import {makeProject} from '@revideo/core';

import gitAdd from '../templates/git-add/scene';
import gitBranch from '../templates/git-branch/scene';
import gitCommit from '../templates/git-commit/scene';
import gitInit from '../templates/git-init/scene';
import gitIntro from '../templates/git-intro/scene';
import gitLog from '../templates/git-log/scene';
import gitMerge from '../templates/git-merge/scene';
import gitPull from '../templates/git-pull/scene';
import gitPush from '../templates/git-push/scene';
import gitStatus from '../templates/git-status/scene';
import gitSwitch from '../templates/git-switch/scene';

export default makeProject({
  scenes: [
    gitAdd,
    gitBranch,
    gitCommit,
    gitInit,
    gitIntro,
    gitLog,
    gitMerge,
    gitPull,
    gitPush,
    gitStatus,
    gitSwitch,
  ],
});