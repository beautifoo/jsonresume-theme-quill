# Contributing to jsonresume-theme-folio

Thank you for considering contributing to jsonresume-theme-folio! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We expect all contributors to adhere to these principles.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Any relevant screenshots
- Your environment (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

If you have an idea for an enhancement, please create an issue with the following information:

- A clear and descriptive title
- A detailed description of the enhancement
- Any relevant mockups or examples
- Why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run the development server to test your changes
5. Commit your changes with descriptive commit messages
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a pull request

## Development Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Create your resume.json in the root directory — the build validates it against the resume contract (ADR 0003): it must be a stable (2.x) resume, and known 1.x field names produce a migration checklist at build time
4. Start the development server: `bun run dev`

## Style Guidelines

- Follow the existing code style
- Use TypeScript for all new code
- Write descriptive comments for complex logic
- Use meaningful variable and function names
- Write clean, modular, and reusable code

## Testing

The project is tested with Vitest (`bun run test`), and the resume contract is enforced at build time (`bun run build`). When submitting changes, run `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build`, and check the rendered theme with your own resume data.

## Documentation

If you add new features or make significant changes, please update the README.md or other documentation as needed.

## Releases

Project maintainers will handle version updates and releases.

Thank you for your contributions!
