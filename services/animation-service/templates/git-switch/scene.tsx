import {makeScene2D, waitFor} from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D(function* (view) {
  const data = {
    command: 'git switch feature-x',
    output: ['Switched to branch \'feature-x\'']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
