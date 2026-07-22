# Animation Service

This service renders dynamic educational video modules using **Revideo** (built on Motion Canvas). It produces fully composed MP4 scenes — including code animations, linked-list diagrams, and synchronized two-line subtitles — driven by structured TypeScript scene files and word-level audio alignment data.

---

## Architecture Overview

```
scripts/
  generate_all_audio.py   ← Generates TTS audio for all 9 scenes via Sarvam AI
  align_audio.py          ← Produces word-level alignment JSON from audio + transcript
  render-all.js           ← Orchestrates the full render pipeline (all scenes → final MP4)
  render-single.js        ← Isolated per-scene renderer (spawned as a child process)

src/
  scenes/                 ← Scene001.tsx … Scene009.tsx  (Revideo animation scenes)
  utils/
    captions.ts           ← Caption cue parsing: cuesFromAlignment() + groupCues()
  assets/
    alignment/            ← Scene00X-alignment.json  (word-level timing data)

render-output/
  raw/                    ← Intermediate per-scene MP4s
  normalized/             ← Audio-muxed & normalized per-scene MP4s

final-hybrid-video.mp4    ← Fully stitched final output
```

---

## Setup Instructions

### Prerequisites
- Node.js 20.x
- Python 3.9+
- FFmpeg (available on `PATH`)
- Chromium / Chrome (path configured in `render-single.js`)

### 1. Install Node dependencies
```bash
cd services/animation-service
npm install
```

### 2. Set environment variables

Create a `.env` file or export variables in your shell:

```bash
# Required: Sarvam AI API key for TTS audio generation
export SARVAM_API_KEY=your_key_here   # Linux/macOS
set SARVAM_API_KEY=your_key_here      # Windows
```

> **Never commit your API key.** The `.gitignore` already excludes `.env` files.

---

## Generating Audio

Generates TTS audio for all 9 scenes using the Sarvam AI `bulbul:v3` model (voice: Tarun, pace: 1.05×, 48 kHz stereo).

```bash
python scripts/generate_all_audio.py
```

Output is saved to `generated_audio/Scene00X-audio.wav`. Already-generated files are skipped automatically.

---

## Generating Caption Alignment Data

Produces word-level timing JSON from the generated audio + the scene transcript:

```bash
python scripts/align_audio.py
```

Output is saved to `src/assets/alignment/Scene00X-alignment.json`. These files are committed to the repo and drive the subtitle system at render time.

---

## Rendering

### Full pipeline (all 9 scenes → final MP4)
```bash
npm run render:full
# Equivalent to: node scripts/render-all.js
```

This will:
1. Render each scene in an **isolated child process** (prevents Vite/Puppeteer memory leaks across scenes).
2. Mux in the TTS audio and normalize each scene to 1920×1080 @ 25fps.
3. Concatenate all normalized scenes into `final-hybrid-video.mp4`.

### Preview a single scene in the editor
```bash
npm start
# Opens the Revideo editor at http://localhost:9003
```

---

## Subtitle System

Captions are rendered as **two lines simultaneously**, driven by `src/assets/alignment/Scene00X-alignment.json`.

**Data flow:**
```
alignment JSON
  → cuesFromAlignment()   (parses word timestamps into Cue[])
  → groupCues()           (groups words into display-timed cues with \n separating line 1 and line 2)
  → captionText / captionText2  (two Txt refs rendered inside a Rect container)
```

Each scene runs two parallel generator threads inside `all()`:
- **Caption thread** — iterates `allCues`, splits on `\n`, and animates both text refs.
- **Animation thread** — handles all scene-specific visual animations.

---

## Running Tests
```bash
npm run test
```

---

## Docker

Build and run via Docker Compose from the repo root:
```bash
docker-compose up -d animation-service
```

> Ensure your container has **≥ 2 GB RAM** per concurrent render worker (Chromium is memory-intensive).
