import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-switch', function* (view) {
  const data = {
    command: 'git switch feature-x',
    output: ['Switched to branch \'feature-x\'']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
