import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-pull', function* (view) {
  const data = {
    command: 'git pull',
    output: ['Already up to date.']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
