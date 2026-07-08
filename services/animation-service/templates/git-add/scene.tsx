import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-add', function* (view) {
  const data = {
    command: 'git add .',
    output: [
      "Changes staged successfully"
    ]
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
