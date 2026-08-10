import io
import wave
import cv2
import numpy as np
from fastapi.testclient import TestClient
from src.main import app, jobs_db

client = TestClient(app)

def get_valid_image_bytes() -> bytes:
    """Generates a small valid PNG image in memory using OpenCV."""
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    cv2.putText(img, "Test Face", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    _, encoded = cv2.imencode('.png', img)
    return encoded.tobytes()

def get_valid_wav_bytes() -> bytes:
    """Generates a small valid WAV audio file in memory."""
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(16000)
        wav_file.writeframes(b'\x00\x00' * 3200) # 0.1 second of silence
    return buf.getvalue()

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"name": "AI Talking Head Service", "status": "healthy"}

def test_generate_avatar_success_job_creation():
    img_bytes = get_valid_image_bytes()
    wav_bytes = get_valid_wav_bytes()

    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    data = {
        'model': 'latentsync',
        'enhancer': 'true'
    }

    response = client.post("/api/v1/avatar/generate", files=files, data=data)
    assert response.status_code == 202
    
    body = response.json()
    assert "job_id" in body
    assert body["status"] == "queued"
    assert "created_at" in body
    assert body["message"] == "Avatar rendering job successfully queued."

    # Check job status query
    job_id = body["job_id"]
    status_resp = client.get(f"/api/v1/avatar/jobs/{job_id}")
    assert status_resp.status_code == 200
    status_body = status_resp.json()
    assert status_body["job_id"] == job_id
    assert status_body["status"] in ["queued", "processing", "failed"]

def test_generate_missing_image():
    wav_bytes = get_valid_wav_bytes()
    files = {
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 422
    assert "error_code" in response.json()

def test_generate_missing_audio():
    img_bytes = get_valid_image_bytes()
    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 422
    assert "error_code" in response.json()

def test_generate_empty_image():
    wav_bytes = get_valid_wav_bytes()
    files = {
        'face_image': ('portrait.png', b'', 'image/png'),
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "EMPTY_FILE"

def test_generate_empty_audio():
    img_bytes = get_valid_image_bytes()
    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.wav', b'', 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "EMPTY_FILE"

def test_generate_corrupted_image():
    wav_bytes = get_valid_wav_bytes()
    files = {
        'face_image': ('portrait.png', b'not an image data', 'image/png'),
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "CORRUPTED_IMAGE"

def test_generate_corrupted_audio():
    img_bytes = get_valid_image_bytes()
    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.wav', b'invalid audio bytes data', 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "CORRUPTED_AUDIO"

def test_generate_unsupported_image_format():
    wav_bytes = get_valid_wav_bytes()
    files = {
        'face_image': ('portrait.txt', b'hello world', 'text/plain'),
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_IMAGE_FORMAT"

def test_generate_unsupported_audio_format():
    img_bytes = get_valid_image_bytes()
    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.txt', b'hello audio', 'text/plain')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_AUDIO_FORMAT"

def test_generate_unsupported_model():
    img_bytes = get_valid_image_bytes()
    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.wav', get_valid_wav_bytes(), 'audio/wav')
    }
    data = {'model': 'sad_talker'}
    response = client.post("/api/v1/avatar/generate", files=files, data=data)
    assert response.status_code == 400
    assert response.json()["error_code"] == "UNSUPPORTED_MODEL"

def test_generate_oversized_image():
    oversized_bytes = b'0' * (26 * 1024 * 1024)
    files = {
        'face_image': ('huge.png', oversized_bytes, 'image/png'),
        'audio': ('speech.wav', get_valid_wav_bytes(), 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 400
    assert response.json()["error_code"] == "FILE_TOO_LARGE"

def test_get_job_status_nonexistent():
    response = client.get("/api/v1/avatar/jobs/nonexistent_job_12345")
    assert response.status_code == 404
    assert response.json()["error_code"] == "JOB_NOT_FOUND"

def test_pipeline_controlled_failure_state():
    """Verifies that background execution safely updates job state to failed when model inference is missing."""
    img_bytes = get_valid_image_bytes()
    wav_bytes = get_valid_wav_bytes()

    files = {
        'face_image': ('portrait.png', img_bytes, 'image/png'),
        'audio': ('speech.wav', wav_bytes, 'audio/wav')
    }
    response = client.post("/api/v1/avatar/generate", files=files)
    assert response.status_code == 202
    job_id = response.json()["job_id"]

    # Directly run pipeline or query status
    from src.pipeline import run_talking_head_pipeline
    job_dir = f"storage/jobs/{job_id}/inputs"
    run_talking_head_pipeline(job_id, f"{job_dir}/image_portrait.png", f"{job_dir}/audio_speech.wav", "latentsync", True, jobs_db)

    assert jobs_db[job_id]["status"] == "failed"
    assert "not implemented" in jobs_db[job_id]["error_message"]
