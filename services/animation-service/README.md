# Animation Service

This service parses animation scene descriptions (JSON timeline) and renders dynamic HTML5-based animations using Revideo (Motion Canvas).

## Setup Instructions

### Local Development (Node.js)

1. Navigate to this directory:
   ```bash
   cd services/animation-service
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```

### Running with Docker

1. Build and run via Docker Compose from the root directory:
   ```bash
   docker-compose up -d animation-service
   ```

### Running Tests
```bash
npm run test
```
