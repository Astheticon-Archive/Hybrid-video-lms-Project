import subprocess
from pathlib import Path


def get_audio_duration(file_path: str) -> float:
    """Get audio duration in seconds using ffprobe."""

    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            file_path,
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    duration = float(result.stdout.strip())

    if duration <= 0:
        raise ValueError("Audio duration is invalid or zero.")

    return duration


def validate_audio_with_ffprobe(file_path: str) -> dict:
    """Validate that the file contains a valid audio stream."""

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    if path.stat().st_size == 0:
        raise ValueError("Audio file is empty.")

    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "a:0",
                "-show_entries",
                "stream=codec_name,sample_rate,channels",
                "-of",
                "default=noprint_wrappers=1",
                file_path,
            ],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        raise ValueError("Invalid or corrupted audio file.") from exc

    if not result.stdout.strip():
        raise ValueError("Input file does not contain a valid audio stream.")

    duration = get_audio_duration(file_path)

    return {
        "duration": duration,
        "metadata": result.stdout.strip(),
    }


def normalize_audio(
    input_path: str,
    output_path: str,
) -> dict:
    """
    Normalize audio to:

    - MP3
    - 44.1 kHz
    - Mono
    - 192 kbps
    """

    input_file = Path(input_path)
    output_file = Path(output_path)

    if not input_file.exists():
        raise FileNotFoundError(f"Audio file not found: {input_path}")

    if input_file.stat().st_size == 0:
        raise ValueError("Audio file is empty.")

    # Validate input first.
    validate_audio_with_ffprobe(str(input_file))

    output_file.parent.mkdir(parents=True, exist_ok=True)

    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(input_file),
                "-vn",
                "-acodec",
                "libmp3lame",
                "-ar",
                "44100",
                "-ac",
                "1",
                "-b:a",
                "192k",
                str(output_file),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f"Audio normalization failed: {exc.stderr}") from exc

    if not output_file.exists():
        raise RuntimeError(
            "Audio normalization completed but output file was not created."
        )

    if output_file.stat().st_size == 0:
        raise RuntimeError("Normalized audio output is empty.")

    # Validate normalized output.
    normalized_info = validate_audio_with_ffprobe(str(output_file))

    return {
        "success": True,
        "input_path": str(input_file),
        "output_path": str(output_file),
        "format": "mp3",
        "duration": normalized_info["duration"],
        "sample_rate": 44100,
        "channels": 1,
    }


def split_audio_into_chunks(
    audio_path: str,
    output_dir: str,
    chunk_duration: int = 20,
) -> list[str]:
    """Split audio into approximately 20-second MP3 chunks."""

    total_duration = get_audio_duration(audio_path)

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    if total_duration <= chunk_duration:
        return [audio_path]

    import math

    number_of_chunks = math.ceil(total_duration / chunk_duration)
    chunk_paths = []

    for index in range(number_of_chunks):
        start_time = index * chunk_duration
        chunk_path = output_path / f"chunk_{index}.mp3"

        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-i",
                    audio_path,
                    "-ss",
                    str(start_time),
                    "-t",
                    str(chunk_duration),
                    "-acodec",
                    "libmp3lame",
                    "-ar",
                    "44100",
                    "-ac",
                    "1",
                    str(chunk_path),
                ],
                capture_output=True,
                text=True,
                check=True,
            )
        except subprocess.CalledProcessError as exc:
            raise RuntimeError(
                f"Failed to create audio chunk {index}: {exc.stderr}"
            ) from exc

        chunk_paths.append(str(chunk_path))

    return chunk_paths
