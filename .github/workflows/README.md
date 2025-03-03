# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing and linting.

## CI Workflow

The CI workflow runs on every push to the `main` branch and on every pull request targeting the `main` branch. It performs the following checks:

1. **Lint and Format Check**: 
   - Runs ESLint to check for code quality issues
   - Runs Prettier to validate code formatting

2. **Type Check and Tests**:
   - Runs TypeScript type checking
   - Runs all tests, including web4 tests and input schema tests
   - Tests with multiple Node.js versions (18.x and 20.x)

### Workflow File
- [ci.yml](./ci.yml)

## How to Use

No additional configuration is required. The workflows will automatically run when:
- Code is pushed to the `main` branch
- A pull request targeting the `main` branch is created or updated

## Customizing Workflows

To modify the workflows:
1. Edit the corresponding YAML file
2. Commit and push your changes
3. The updated workflow will be used for all subsequent triggers 