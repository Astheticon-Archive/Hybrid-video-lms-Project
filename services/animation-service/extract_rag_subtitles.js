import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_PATH = path.join(__dirname, 'templates/rag/src/project.tsx');
const SCENES_DIR = path.join(__dirname, 'templates/rag/src/scenes');
const OUTPUT_FILE = path.join(__dirname, 'src/rag_subtitles.js');

function extract() {
  console.log("Reading RAG project file...");
  const projectContent = fs.readFileSync(PROJECT_PATH, 'utf-8');

  // Match all imports of scenes in project.tsx
  // e.g. import scene1 from './scenes/scene1';
  const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/scenes\/(\w+)['"]/g;
  const importsMap = {};
  let match;
  while ((match = importRegex.exec(projectContent)) !== null) {
    importsMap[match[1]] = match[2];
  }

  // Find the scenes array in makeProject
  const scenesArrayRegex = /scenes:\s*\[([\s\S]*?)\]/;
  const scenesArrayMatch = scenesArrayRegex.exec(projectContent);
  if (!scenesArrayMatch) {
    console.error("Could not find scenes array in project.tsx");
    return;
  }

  const scenesListRaw = scenesArrayMatch[1];
  const sceneVariableRegex = /(\w+)\s*,/g;
  const orderedScenes = [];
  while ((match = sceneVariableRegex.exec(scenesListRaw)) !== null) {
    const varName = match[1];
    if (importsMap[varName]) {
      orderedScenes.push(importsMap[varName]);
    }
  }

  console.log("Ordered RAG Scenes:", orderedScenes);

  const subtitlesList = [];
  for (const sceneFileName of orderedScenes) {
    const filePath = path.join(SCENES_DIR, `${sceneFileName}.tsx`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Scene file ${sceneFileName}.tsx not found`);
      continue;
    }

    const sceneContent = fs.readFileSync(filePath, 'utf-8');
    // Match typeText(captionTxt, '...', ...)
    const typeTextRegex = /typeText\(\s*captionTxt\s*,\s*(['"`])([\s\S]*?)\1/;
    const typeMatch = typeTextRegex.exec(sceneContent);
    if (typeMatch) {
      subtitlesList.push(typeMatch[2].replace(/\s+/g, ' ').trim());
    } else {
      console.warn(`Could not find typeText for captionTxt in ${sceneFileName}.tsx, using fallback`);
      subtitlesList.push("Retrieval-Augmented Generation processes and enhances language model accuracy.");
    }
  }

  const outputContent = `export const ragSubtitlesList = ${JSON.stringify(subtitlesList, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_FILE, outputContent);
  console.log(`Successfully generated RAG subtitles. Stored ${subtitlesList.length} items in src/rag_subtitles.js`);
}

extract();
