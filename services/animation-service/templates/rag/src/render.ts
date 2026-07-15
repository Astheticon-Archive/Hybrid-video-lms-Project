import { renderVideo } from "@revideo/renderer";

async function render() {
  try {
    console.log("Rendering video...");

    const file = await renderVideo({
      projectFile: "./src/project.tsx",
      settings: {
        logProgress: true,
      },
    });

    console.log("Finished!");
    console.log(file);
  } catch (err) {
    console.error(err);
  }
}

render();
