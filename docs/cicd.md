![See diagram](img/quality_gates.png) ([original draw.io file](https://app.diagrams.net/#G1MAdckksLJ2GoWbNJXtwGSnA4tjsecsHI))


# CICD

## CI/CD Quality Gates
    .github/workflows/quality-gates.yml

&nbsp;

1. ### Lint Check
    - lints files in repo according to `.eslintrc.js` configuration

2. ### Client Unit Tests
    - Is run in parallel with `API Unit Tests` job
    - Requires `Lint Check` job to pass to run
    - runs `src/client/package.json > scripts > test-unit:ci` 
    - runs jest with config: `src/client/jest.config.ts` and coverage on
      - coverage definitions come from a config file that is shared by client and api: `shared-jest.config` in project root
    - **IMPORTANT**: Mock all external calls to APIs and services for test isolation and idempotent results in pipelines
    - **Conditions to Pass**:
      - All tests must pass
      - Coverage must be:
        - **branches**: >= 75%,
        - **functions**: >= 75%,
        - **lines**: >= 75%,
        - **statements**: >= 75%
  
3. ### API Unit Tests

    - Is run in parallel with `Client Unit Tests` job
    - Requires `Lint Check` job to pass to run
    - runs `package.json > scripts > test-unit:ci` 
    - runs jest with config: `jest.config.ts` and coverage on
      - coverage definitions come from a config file that is shared by api and client: `shared-jest.config` in project root
    - **IMPORTANT**: Mock all external calls to APIs and services for test isolation and idempotent results in pipelines
    - **Conditions to Pass**:
      - All tests must pass
      - Coverage must be:
        - **branches**: >= 75%,
        - **functions**: >= 75%,
        - **lines**: >= 75%,
        - **statements**: >= 75%

4. ### Client Integration Tests

    - Is run in parallel with `API Integration Tests` job
    - Requires `API Unit Test` and `Client Unit Test` jobs to pass to run
    - runs `src/client/package.json > scripts > test-integration:ci` 
    - runs cypress and a local web client
    - uses `runner.js` to set some dynamic environment variables needed in order to provide proper test context
    - **Conditions to Pass**:
      - All tests must pass
        - failures will generate snapshots and/or videos, which will be uploaded to github
  
5. ### API Integration Tests
    
    - Is run in parallel with `Client Integration Tests` job
    - Requires `API Unit Test` and `Client Unit Test` jobs to pass to run
    - runs `package.json > scripts > test-integration:ci` 
    - runs cypress and a local api server
    - uses `runner.js` to set some dynamic environment variables needed in order to provide proper test context
    - **Conditions to Pass**:
      - All tests must pass
        - failures will generate snapshots and/or videos, which will be uploaded to github

## Deploy an environment for a given (non `master`) branch
      .github/workflows/deploy-environment-branch.yml
  
  1. All branch pushes trigger deployment to `{gh username}-{urlsafe branch name}.{domainname.com}` 
     - contingent upon:
        1. all quality gates must pass
        2. data migrations must succeed

## Deploy to Dev
      .github/workflows/deploy-environment-dev.yml

  1. All pushes to `master` trigger deployment to `dev.{domainname.com}`
      - contingent upon:
        1. all quality gates must pass
        2. data migrations must succeed

## Deploy Prod
    .github/workflows/deploy-environment-prod.yml

  1. Deploys to `prod` if tag:
      - is formatted correctly (must be valid semver `X.X.X` or `vX.X.X`)
      - is found in `master` branch history (by commit hash)
      - semver matches version in `package.json` and `src/client/package.json`
      - contingent upon:
        1. all quality gates must pass
        2. data migrations must succeed


## Reversion Tags
    .github/workflows/revert-environment.yml

  1. Reverts `prod` to a previous release if tag:
     - is a reversion tag (tag contains `-revert-`)
     - tag (commit hash without `-revert-` reversion token) is found in `master` branch history
     - **without** reversion token is compliant semver (must be semver `X.X.X-revert-` -> `X.X.X` or `vX.X.X-beta--revert-1` -> `vX.X.X-beta-1`)
     - tag semver matches version in `package.json` and `src/client/package.json` in the historic tag/commit

## Branch Cleanup
    .github/workflows/cleanup.yml

  1. If branch is not `master`, any existing branch-specific environment for the current branch in aws is removed/undeployed
