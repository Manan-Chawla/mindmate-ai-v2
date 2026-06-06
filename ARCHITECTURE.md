# Architecture of MindMate AI

MindMate AI is built using a modular, feature-based architecture pattern utilizing ES6 Modules to ensure a separation of concerns, DRY principles, and maintainability without the overhead of a heavy framework like React.

## Core Principles
1. **No Backend Required**: All user data is securely stored in the browser's `localStorage`.
2. **Modular Features**: Each feature (e.g., chat, focus, mood) is self-contained within `src/features/`.
3. **Centralized Config**: API URLs, local storage keys, and app constraints are in `src/config/constants.js`.
4. **Service Layer**: The `StorageService` (`src/core/storage.js`) and `GeminiAPI` (`src/core/api.js`) abstract away direct browser/network APIs.

## Folder Structure
- `/assets/`: Static assets (CSS, Images)
- `/src/core/`: Core generic services (API, Storage, Utils)
- `/src/config/`: App-wide constants and theme logic
- `/src/features/`: Domain-specific business logic (Chat, Journal, Roadmap, etc.)
- `/*.html`: The UI views.

This structure allows the application to scale horizontally as new features are added.
