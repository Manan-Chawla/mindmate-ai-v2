# Testing Strategy for MindMate AI

MindMate AI relies entirely on client-side technologies. Our testing strategy encompasses multiple layers to ensure reliability, accessibility, and performance.

## Directory Structure
The tests are organized as follows:
\`\`\`
tests/
├── unit/             # Logic tests for scoring, local storage, API wrappers
├── integration/      # Testing interactions between modules
├── ui/               # DOM manipulation and event listener tests
├── accessibility/    # Automated a11y testing scripts (e.g. axe-core)
└── performance/      # Lighthouse CI configurations and benchmarks
\`\`\`

## Running Tests
Currently, this is a static project. To run unit tests locally without a Node backend, you can open `tests/unit/runner.html` (to be implemented) in a browser, which uses a lightweight assertion library.

## Manual Testing Checklist
1. **Mood Tracking**: Ensure logging a mood updates the dashboard chart and streaks.
2. **AI Journal**: Ensure a prompt > 10 chars successfully triggers Gemini and renders JSON results without crashing.
3. **Chat**: Test Markdown parsing and ensure context history does not exceed 50 messages.
4. **Focus Timer**: Test start/pause/reset and the transition from Work -> Break.

For full coverage goals, we target >95% on all Lighthouse metrics.
