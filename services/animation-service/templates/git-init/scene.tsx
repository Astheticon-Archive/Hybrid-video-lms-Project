import {makeScene2D} from '@revideo/core';
import {Terminal} from './component';
import {waitFor} from '@revideo/core';

export default makeScene2D(function* (view) {
  const data = {
    command: 'git init',
    output: ['Initialized empty Git repository in /path/to/repo/.git/']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
