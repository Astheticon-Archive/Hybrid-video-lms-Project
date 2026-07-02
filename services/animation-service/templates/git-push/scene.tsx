import {makeScene2D, waitFor} from '@revideo/core';
import {Terminal} from './component';

export default makeScene2D(function* (view) {
  const data = {
    command: 'git push',
    output: ['Enumerating objects: 3, done.', 'Total 3 (delta 0), reused 0 (delta 0), pack-reused 0', 'To github.com:user/repo.git', ' * [new branch]      main -> main']
  };

  view.add(<Terminal command={data.command} output={data.output} />);
  yield* waitFor(2);
});
