# Frontend Design - Community News Board

Purpose
- Build a modern, responsive news reporting UI with three screens: Login/Register -> Main Screen -> Create Post (modal).
- Follow backend flows in Backend/frontend-api-guide.md for auth, posts, and presigned uploads.

Design goals
- Clear news aesthetic: bold headlines, readable body text, calm neutral palette with a single accent color.
- Fast scanning: cards, spacing, and strong hierarchy.
- Accessible and keyboard-friendly UI, including modal focus trap.

Information architecture
- Login/Register
- Main Screen (feed)
- Create Post (modal dialog)

Screen details

1) Login/Register
- Fields: username, password.
- Actions: register and login with backend endpoints.
- Success state: store username and userId in client state and localStorage; route to Main Screen.
- Errors: inline error messaging for 400/401/409.

2) Main Screen
- Header: app title, logged-in username, Create Post button, Logout button.
- Feed: scrollable list ordered newest -> oldest. Client-side pagination with infinite scroll.
- Each PostCard: headline, timestamp, truncated body, image thumbnail.
- Empty state: "No posts yet" with Create Post CTA.

3) Create Post (modal dialog)
- Fields: headline, body, image upload.
- Flow:
  1. Presign PUT for the selected image.
  2. Upload file to S3 with returned URL.
  3. Create post with imageKey, headline, body.
  4. Close modal and refresh feed.
- Validation: headline and body required; image required by backend.
- UX: progress indicator, disabled submit during upload, cancel button.

Key components
- AppShell: layout, header, routing outlet.
- AuthForm: login and register mode.
- PostsFeed: infinite scroll and pagination.
- PostCard: consistent visual layout for a post.
- CreatePostModal: form, upload progress, submit.
- ApiClient: single axios instance with typed API methods.
- useAuth: auth context, persistence to localStorage.
- usePosts: React Query hook for posts.

Data and API mapping
- POST /api/auth/register
- POST /api/auth/login
- GET /api/posts
- POST /api/uploads/presign (PUT URL)
- POST /api/uploads/presign-get (GET URL)
- POST /api/posts

Image handling
- Presign GET is required for both thumbnail and original keys.
- Thumbnails are async; show placeholder if missing and retry later.
- Use local preview for selected images before upload.

Pagination
- Backend returns full list; front-end slices it into pages (default 10 per step).
- Infinite scroll loads next slice when near bottom.

State management
- Auth state: React Context + localStorage.
- Server data: React Query for caching and invalidation.
- On create post: invalidate posts query or optimistic insert.

Error handling and resilience
- Toast or inline error for failed login/register/upload/create.
- Retry buttons for upload and image fetch.
- Network timeouts surfaced with friendly messaging.

Accessibility
- Labels for all inputs.
- Modal focus trap and ESC to close.
- Keyboard navigation for feed and buttons.
- Adequate color contrast and visible focus rings.

Responsive behavior
- Mobile: single column, modal becomes full-screen drawer.
- Desktop: two-column header with actions aligned right, feed centered.

Out of scope
- Editing/deleting posts.
- Post detail page.
