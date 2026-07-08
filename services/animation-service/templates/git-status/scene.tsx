import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-status', function* (view) {
  const data = {
    command: 'git status',
    output: ['On branch main', 'nothing to commit, working tree clean']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
