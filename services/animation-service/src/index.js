import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory render job database
const rendersDb = new Map();

app.get('/', (req, res) => {
  res.json({ name: 'Animation Service', status: 'healthy' });
});

app.post('/render', (req, res) => {
  const { timeline, resolution, fps } = req.body;
  
  if (!timeline || !Array.isArray(timeline)) {
    return res.status(400).json({ error: 'Missing or invalid timeline list.' });
  }

  const renderId = `render_${uuidv4().replace(/-/g, '').slice(0, 8)}`;
  
  // Create job details
  const renderJob = {
    render_id: renderId,
    status: 'completed', // Dummy sync completion
    output_file: `/outputs/${renderId}.mp4`,
    render_duration_seconds: 4.15,
    resolution: resolution || { width: 1920, height: 1080 },
    fps: fps || 30
  };

  rendersDb.set(renderId, renderJob);
  
  return res.status(200).json(renderJob);
});

app.listen(port, () => {
  console.log(`Animation Service running on port ${port}`);
});
