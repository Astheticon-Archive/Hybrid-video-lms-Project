import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-init', function* (view) {
  const data = {
    command: 'git init',
    output: ['Initialized empty Git repository in /path/to/repo/.git/']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
