import { makeScene2D } from '@revideo/2d';
import { waitFor } from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D('git-commit', function* (view) {
  const data = {
    command: 'git commit -m "Initial commit"',
    output: ['[main (root-commit) a1b2c3d] Initial commit', '1 file changed, 1 insertion(+)']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
