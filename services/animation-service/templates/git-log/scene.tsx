import {makeScene2D, waitFor} from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D(function* (view) {
  const data = {
    command: 'git log',
    output: ['commit a1b2c3d', 'Author: User <user@example.com>', 'Date:   Thu Jul 2 12:00:00 2026', '', '    Initial commit']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
