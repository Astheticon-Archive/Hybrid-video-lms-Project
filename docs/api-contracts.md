# API Contracts

This document outlines the API specifications and communication formats for the services in the Hybrid Video LMS.

---

## 1. Talking Head Service API

### Base URL
`http://localhost:8000/api/v1`

### Generate Talking Head Avatar
Synthesizes a speaking avatar video using a target audio file and face template image.

* **Endpoint:** `/avatar/generate`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`

#### Request Body
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `face_image` | File | Yes | Reference portrait image (`.png` or `.jpg`). |
| `audio` | File | Yes | Audio file containing the voice track (`.wav` or `.mp3`). |
| `model` | String | No | Model to use (`latentsync`, `sad_talker`, `live_portrait`, `muse_talk`). Default: `latentsync`. |
| `enhancer` | Boolean | No | Enable face restoration/enhancement (e.g. GFPGAN). Default: `true`. |

#### Response (`202 Accepted`)
```json
{
  "job_id": "job_e98218fb_2ad8",
  "status": "queued",
  "created_at": "2026-06-30T09:53:30Z",
  "message": "Avatar rendering job successfully queued."
}
```

### Get Job Status / Result
Retrieves the status or the output of a queued generation job.

* **Endpoint:** `/avatar/jobs/{job_id}`
* **Method:** `GET`

#### Response (`200 OK` - In Progress)
```json
{
  "job_id": "job_e98218fb_2ad8",
  "status": "rendering",
  "progress": 42.5,
  "estimated_time_remaining": 15.2
}
```

#### Response (`200 OK` - Completed)
```json
{
  "job_id": "job_e98218fb_2ad8",
  "status": "completed",
  "completed_at": "2026-06-30T09:54:10Z",
  "output_url": "/outputs/avatar_e98218fb_2ad8.mp4",
  "checksum": "sha256:d8f763...8afb"
}
```

---

## 2. Animation Service Schema Contract

The Animation Service processes JSON input specifying timing, styles, and animation scenes.

### Rendering Request Payload
* **Endpoint:** `/render`
* **Method:** `POST`
* **Content-Type:** `application/json`

#### Example Body
```json
{
  "resolution": {
    "width": 1920,
    "height": 1080
  },
  "fps": 30,
  "theme": {
    "primaryColor": "#6366f1",
    "secondaryColor": "#1e1b4b",
    "backgroundColor": "#0f172a",
    "fontFamily": "Outfit"
  },
  "timeline": [
    {
      "id": "scene_1",
      "type": "code-animation",
      "duration": 5.5,
      "properties": {
        "title": "Quick Sort Partitioning",
        "code": "def partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    ...",
        "language": "python",
        "highlights": [
          {"line": 2, "color": "rgba(99, 102, 241, 0.2)"}
        ]
      }
    },
    {
      "id": "scene_2",
      "type": "flowchart",
      "duration": 4.0,
      "properties": {
        "nodes": [
          {"id": "n1", "label": "Start", "type": "oval"},
          {"id": "n2", "label": "i < len(arr)", "type": "diamond"}
        ],
        "edges": [
          {"from": "n1", "to": "n2", "label": "Init"}
        ]
      }
    }
  ]
}
```

#### Response (`200 OK`)
```json
{
  "render_id": "render_c398df91",
  "status": "completed",
  "output_file": "/outputs/render_c398df91.mp4",
  "render_duration_seconds": 8.42
}
```
