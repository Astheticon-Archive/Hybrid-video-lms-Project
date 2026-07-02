import {makeScene2D, waitFor} from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D(function* (view) {
  const data = {
    command: 'git status',
    output: ['On branch main', 'nothing to commit, working tree clean']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
