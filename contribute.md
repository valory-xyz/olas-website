# Contributing to Olas Website

Thank you for your interest in contributing! This document provides guidelines for contributing code to this repository.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Quality](#code-quality)
- [Pull Request Process](#pull-request-process)
- [Getting Help](#getting-help)

## Getting Started

Before contributing, please:

1. Review the [README](README.md) for setup instructions
2. Use **yarn** for install and scripts (this repo prefers yarn over npm/pnpm)
3. Check the Issues page for open tasks

## Development Workflow

### 1. Choose an Issue

- Find an issue you'd like to work on
- Comment on the issue to indicate you're working on it to avoid duplicate efforts
- If you're proposing a new feature, open an issue first to discuss it

### 2. Create a Branch

Follow the naming convention with kebab-case:

```bash
# For features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For chores/maintenance
git checkout -b chore/description
```

### 3. Make Changes

- Write clear, focused commits
- Follow the code quality guidelines below
- Test your changes thoroughly
- Update documentation if your changes affect user-facing features or developer workflows

### 4. Test Your Changes

```bash
# Run the development server
yarn dev

# Run linting
yarn lint

# Run linting with auto-fix
yarn lint:fix

# Run build to ensure no build errors
yarn build
```

Ensure all checks pass before submitting.

### 5. Submit a Pull Request

- Push your branch to GitHub
- Create a pull request with a clear description
- Reference any related issues
- Ensure all CI checks pass

## Code Quality

### JavaScript/TypeScript Standards

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is enforced via Prettier
- **TypeScript**: Use TypeScript for new utility code in `common-util/`

### Code Style Guidelines

- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Follow existing patterns in the codebase
- Avoid code duplication—extract shared logic to `common-util/`

### File Organization

- `pages/` — Next.js pages and API routes
- `components/` — React components
- `common-util/` — Shared utilities and API logic
- `data/` — Static data files
- `public/` — Static assets
- `styles/` — Global styles

## Pull Request Process

### PR titles and commit messages

**PR titles** must follow the same conventional commit format as commit messages. See the [conventional commits reference](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13#types) for the full spec.

**Types:**
- `feat`: New feature (API or UI)
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, whitespace, etc.) — no behavior change
- `refactor`: Restructure code without changing API/UI behavior
- `perf`: Performance improvement
- `test`: Add or update tests
- `build`: Build tooling, dependencies, version
- `ops`: Infrastructure, CI/CD, deployment, monitoring
- `chore`: Other tasks (e.g. init, .gitignore)

Use **imperative, lowercase** description; no period at the end. Optional scope in parentheses: `feat(ui): add button`.

**Examples:**
```
feat: add wallet connection feature
fix: resolve navigation issue on mobile
docs: update contribute.md with testing guidelines
```

### Before Submitting

1. **Run code quality checks**
   ```bash
   yarn lint
   yarn build
   ```

2. **Ensure your branch is up to date** with the base branch

3. **Use a conventional commit-style PR title** (e.g. `feat: add X` or `fix: resolve Y`)

4. **Write a clear PR description** explaining what changed and why

5. **Add screenshots/recordings** for UI changes

6. **Update meta title and description** if modifying pages

### PR Review Process

1. **Automated checks** run via CI
2. **Code review** by maintainers—address all feedback
3. **Approval and merge** by maintainers

## Getting Help

- **Setup & Usage**: Check the [README](README.md)
- **Issues**: Search existing issues or create new ones
- **Security**: See [SECURITY.md](SECURITY.md) for security-related issues

## License

By contributing to this project, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

---

Thank you for contributing! 🚀
