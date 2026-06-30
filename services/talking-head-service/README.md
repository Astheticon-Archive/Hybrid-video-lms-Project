# AI Talking Head Service

This service generates realistic talking head videos using reference portrait images and target audio files.

## Setup Instructions

### Local Development (Python Virtual Environment)

1. Navigate to this directory:
   ```bash
   cd services/talking-head-service
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server locally:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```
5. Open `http://localhost:8000/docs` in your browser to view the OpenAPI (Swagger) documentation.

### Running with Docker

1. Build and run via Docker Compose from the root directory:
   ```bash
   docker-compose up -d talking-head-service
   ```

### Running Tests
```bash
pytest tests/
```
