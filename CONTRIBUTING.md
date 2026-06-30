# Contributing to Hybrid Video LMS

First off, thank you for taking the time to contribute! This project follows an open-source style workflow to maintain accountability, reduce merge conflicts, and ensure high-quality integrations.

Please read and follow these guidelines to make collaboration smooth and efficient.

---

## Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Branch Naming Convention
We enforce a strict branch naming convention. Never commit directly to `main`. Create branches with the following formats:

* `feature/<feature-name>` (e.g., `feature/avatar-api`, `feature/latentsync-inference`, `feature/json-renderer`, `feature/code-animation`, `feature/flowchart-template`, `feature/transition-library`)
* `bugfix/<bug-name>` (e.g., `bugfix/render-time`)
* `docs/<doc-name>` (e.g., `docs/api-documentation`)

---

## Commit Message Convention
Use meaningful commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) standard.

### Examples:
* `feat: add LatentSync inference pipeline`
* `feat: implement JSON animation renderer`
* `feat: add flowchart template`
* `fix: resolve FFmpeg rendering issue`
* `docs: update API documentation`
* `refactor: optimize animation pipeline`

---

## Pull Request Rules
Every Pull Request (PR) must meet the following criteria before it can be merged:

1. **Reference the GitHub Issue:** The PR description must link to the issue it resolves (e.g., `Closes #8`).
2. **Demo Video/Visuals:** Include screenshots, GIFs, or a link to a demo video (2–5 minutes) showing the feature running successfully.
3. **Changelog:** Explain clearly what was changed and the reasoning behind design choices.
4. **Testing details:** Explain how the change was tested and provide instructions for reviewers to verify the changes.
5. **No Merge Conflicts:** Keep your branch up to date with the `main` branch.
6. **Code Review:** All PRs require approval from at least one maintainer or peer reviewer. **Do not merge your own Pull Request.**

---

## Project Workflow for Contributors

Follow these steps to make your contributions:

### Step 1: Fork the Repository
Fork the main repository `hybrid-video-lms` to your personal GitHub account.

### Step 2: Clone Your Fork
Clone your fork locally:
```bash
git clone <your-fork-url>
cd hybrid-video-lms
```

### Step 3: Add the Original Repository as Upstream
Add the upstream repository to pull the latest changes:
```bash
git remote add upstream <main-repository-url>
```

### Step 4: Ask for Your Assigned Issue
Before starting any work, check the GitHub Issues and ask the project owner or maintainer to assign you the issue. **Do not begin development until the issue has been assigned to you.**

### Step 5: Sync Your Fork
Always pull the latest changes from upstream before starting development:
```bash
git checkout main
git pull upstream main
```

### Step 6: Create a Feature/Bugfix Branch
Do **not** work on the `main` branch. Create a new branch:
```bash
git checkout -b feature/<feature-name>
```

### Step 7: Develop and Commit
Develop your changes and commit regularly using conventional commit formats:
```bash
git add .
git commit -m "feat: implement JSON renderer"
```

### Step 8: Demonstrate Your Work
Before creating a Pull Request, record a short demo (2–5 minutes) showing:
* The feature running successfully.
* How it works.
* Any important implementation details.

Share this video in the project group so everyone can verify the feature is functional and stay updated on overall progress.

### Step 9: Push Your Branch
Push your feature branch to your fork:
```bash
git push origin feature/<feature-name>
```

### Step 10: Raise a Pull Request
Create a Pull Request from your fork's branch to the upstream `main` branch. Complete the Pull Request template, providing all requested details (e.g. Issue number, summary, tests, and link to the demo video).

### Step 11: Code Review & Iteration
Wait for the review. Address any requested feedback by making additional commits on your branch and pushing them. Once approved, the maintainer will merge the PR.

---

## Repository Rules (Quick Summary)
* ❌ **Never push directly to `main`.**
* ❌ **Never work on an issue that has not been assigned to you.**
* ❌ **Never merge your own Pull Request without approval.**
* ✅ Keep Pull Requests focused on a single issue.
* ✅ Write clean, well-documented, and readable code.
* ✅ Update the documentation if your changes affect APIs or workflows.
* ✅ Test your feature thoroughly before opening a Pull Request.
* ✅ Share a working demo video in the project group before requesting a review.
