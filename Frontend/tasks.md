# Frontend Tasks - Community News Board

Milestone 1 - Project scaffolding (2-3h)
- Create Vite + React app in Frontend/.
- Install Tailwind, React Router, React Query, Axios.
- Initialize Tailwind config and base styles.
- Verify dev server runs.

Milestone 2 - API client and types (2h)
- Implement ApiClient methods:
  - register, login
  - getPosts
  - presignPut, presignGet
  - createPost

Milestone 3 - Auth flow (3-4h)
- Build AuthForm with login/register tabs.
- Add useAuth context with localStorage persistence.
- Route: auth -> main on success; logout clears localStorage.
- Verify 400/401/409 error handling.

Milestone 4 - Feed and PostCard (6h)
- Build PostsFeed with infinite scroll and client-side pagination.
- Render PostCard with headline, timestamp, snippet, and thumbnail.
- Add empty and loading states.

Milestone 5 - CreatePost modal and upload (4-6h)
- Create modal dialog with headline, body, image file.
- Implement presign PUT, upload progress, and create post call.
- Close modal on success and refresh feed.
- Add validation and error states.

Milestone 6 - Caching and refresh (2-3h)
- Use React Query to cache posts.
- Invalidate posts after create or optimistic insert.

Milestone 7 - Styling and theme (3-5h)
- Apply news-themed layout: bold headlines, clean cards, muted palette.
- Add responsive layout for mobile and desktop.

Milestone 8 - Docs (1h)
- Add Frontend/README.md with start and build steps.
- Add notes about presigned uploads and thumbnail delay.
