import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-merge', function* (view) {
  const data = {
    command: 'git merge feature-x',
    output: ['Updating a1b2c3d..e4f5g6h', 'Fast-forward']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
