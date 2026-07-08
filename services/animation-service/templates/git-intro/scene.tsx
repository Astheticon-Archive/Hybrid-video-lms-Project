import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-intro', function* (view) {
  const data = {
    command: 'git intro',
    output: ['Welcome to Git!']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
