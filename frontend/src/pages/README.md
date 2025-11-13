# Pages conventions

- One folder per page under `src/pages/<page>`.
- Default export via `index.jsx` for simple imports (barrel files are fine).
- Page-specific styles use CSS Modules (e.g., `NotFound.module.css`) colocated with the page.
- Keep reusable UI, logic, and hooks out of `pages/`:
  - Components → `src/components/...`
  - Hooks → `src/hooks/...` (e.g., chat hooks at `src/hooks/chat/*`)
  - Utilities → `src/utils/...`

Current structure highlights

- `pages/not-found/` contains the 404 page (`index.jsx` + `NotFound.module.css`).
- Chat-specific hooks moved from `pages/chat` to `src/hooks/chat`.
- Each major page folder has an `index.jsx` that re-exports the main component to standardize imports.

How to add a new page

1. Create `src/pages/<name>/<Component>.jsx`.
2. Add `src/pages/<name>/index.jsx` with `export { default } from "./<Component>";`.
3. Add a route import using `../pages/<name>`.
