**Stories and Subtasks (Outline)**

(numbers are just for this doc, actual Jira numbers will be different of course)
Story 1: Backend MVP
- 1.1 Auth endpoints + JWT (Aric)
- 1.2 Events endpoints (list/detail/create) (Aric)
- 1.3 Admin approvals endpoints (Aric)
- 1.4 API spec + seeds + env (Aric)

Story 2: FE Auth Integration
- 2.1 API client + token storage (Jonathan)
- 2.2 Wire Login (Jonathan)
- 2.3 Wire Signup (Jonathan)
- 2.4 Protected routes + useAuthUser (Jonathan)

Story 3: Events List/Create Integration
- 3.1 Events list → GET API (Manmeet)
- 3.2 EventCard compatibility (Manmeet)
- 3.3 Create Event submit → POST API (Manmeet)
- 3.4 Create Event auth check (Manmeet)

Story 4: Event Details + Admin Actions
- 4.1 Event Details → GET by ID (Selena)
- 4.2 Loading/404/error states (Selena)
- 4.3 Verify role-driven UI gates (Selena)
- 4.4 Admin approve/deny actions (Selena)

**Order Of Work (Tiers)**
- Tier 0 — Repo/Env setup (parallel)
  - Everyone: pull latest main; ensure Node 20+; install deps.
  - Frontend: set `VITE_API_URL=http://localhost:5001`.
  - Backend: set `.env` with `MONGO_URI`, `JWT_SECRET`, `PORT=5001`, `CLIENT_ORIGIN=http://localhost:5173`.

- Tier 1 — Backend Auth foundation (Aric)
  - Build `POST /api/auth/register` and `POST /api/auth/login` with JWT + bcryptjs; add CORS/JSON middleware and auth/role middleware.
  - Output includes `{ token, user: { id, email, role } }`.
  - Unblocks: Jonathan’s Login/Signup and ProtectedRoute work.

- Tier 2 — Events domain (Aric)
  - Event model and routes: `GET /api/events` (approved), `GET /api/events/:id`, `POST /api/events` (organizer → pending).
  - Simple query params `?q=&category=` optional; FE can still filter client-side.
  - Unblocks: Manmeet’s Events list and Create submit; Selena’s Details fetch.

- Tier 3 — FE Auth wiring (Jonathan)
  - Implement `api.js` helper, wire Login/Signup to backend, persist `{token,user}` in localStorage, guard routes.
  - After this, Manmeet/Selena can rely on stored auth for organizer/admin gating.

- Tier 4 — FE Events integrations (Manmeet)
  - Replace mock list with `GET /api/events` and wire Create submit to `POST /api/events` (organizer only).
  - Keep existing client search/filter; no image upload; `imageUrl` can be empty.

- Tier 5 — Admin actions (Selena)
  - Fetch event by id and wire admin approve/deny to `POST /api/admin/events/:id/{approve|deny}`; update status chip live.

- Finalization — API spec + seeds (Aric, can be parallel after Tier 2)
  - Document request/response shapes; add small seed script for 1 organizer, 1 volunteer, a few events (2 approved, 1 pending).

**Dependencies (what to install/configure)**
- Prereqs
  - Node.js 20+ and npm 10+ on all machines
  - MongoDB Atlas access (each dev has a user; use the provided cluster URI)
- Backend (from `mern-stack/`)
  - Packages to add: `npm i cors bcryptjs jsonwebtoken`
  - Already present: `express mongoose mongodb dotenv nodemon`
  - Env file: `mern-stack/.env`
    - `MONGO_URI` — already set in your .env; each dev uses their own user/password in the same URI format
    - `JWT_SECRET` — add a random string (e.g., a long UUID)
    - `PORT=5001`
    - `CLIENT_ORIGIN=http://localhost:5173`
  - Run: `npm run dev` (nodemon starts backend on 5001)
- Frontend (from `mern-stack/frontend/`)
  - Env file: `mern-stack/frontend/.env.local`
    - `VITE_API_URL=http://localhost:5001`
  - Run: `npm run dev` (Vite on 5173)
- Optional tools
  - REST client (Thunder Client/VSCode REST Client/Postman) for testing endpoints
  - Git workflow: feature branches per story/subtask, PR to `main`

**By Person (numbered subtasks)**
- Aric
  1.1) Auth endpoints + JWT
     - Implement `POST /api/auth/register`, `POST /api/auth/login` using `bcryptjs` and JWT; add `cors`, `express.json()`, and `auth`/`requireRole` middleware.
     - Response: `{ token, user: { id, email, role } }`. Errors return `{ error: { message } }` with 400/401.
     - Files: `backend/server.js`, `backend/config/db.js`, `backend/models/User.js`, `backend/middleware/auth.js`, `backend/routes/auth.js`.
  1.2) Events endpoints (list/detail/create)
     - Model fields: `title, description, category, date, startTime, endTime, address, capacity, imageUrl, status(pending|approved|denied), owner`.
     - Routes: `GET /api/events` (approved only), `GET /api/events/:id` (approved or owner/admin), `POST /api/events` (organizer → pending).
     - Return shapes: `{ events: [...] }`, `{ event: {...} }`. Validate minimal required fields; 201 on create.
     - Files: `backend/models/Event.js`, `backend/routes/events.js`.
  1.3) Admin approvals endpoints
     - `POST /api/admin/events/:id/approve` and `/deny` protected by `requireRole('admin')`.
     - Returns updated event `{ event }`; 404 if not found; 200 on success.
     - Files: `backend/routes/admin.js`.
  1.4) API spec + seeds + env
     - Write `API_SPEC.md` with request/response samples and headers. Seed: 1 organizer, 1 volunteer, 2 approved events, 1 pending.
     - Files: `API_SPEC.md`, `backend/scripts/seed.js`; ensure `.env` includes `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`.

- Jonathan
  2.1) API client + token storage
     - Create `api.js` with `api(path, {method, body})`; reads `VITE_API_URL`; attaches `Authorization: Bearer <token>` from `localStorage.user.token`.
     - Helpers `get/post/patch/delete`; parse JSON; throw on non-2xx with message.
     - File: `frontend/src/lib/api.js`.
  2.2) Wire Login
     - On submit: POST `/api/auth/login` with `{email,password}`; save `{token,user}` to `localStorage`.
     - Redirect by role: admin → `/dashboard/admin`, organizer → `/dashboard/organizer`, volunteer → `/dashboard/volunteer`.
     - File: `frontend/src/pages/Auth/LoginPage.jsx`.
  2.3) Wire Signup
     - On submit: POST `/api/auth/register` with `{firstName,lastName,email,password,role}`; on success route to `/` (Sign In).
     - Basic inline error display; keep existing client validations.
     - File: `frontend/src/pages/Auth/SignupPage.jsx`.
  2.4) Protected routes + useAuthUser
     - Centralize `useAuthUser` to read `{user,token}`; update `ProtectedRoute` to gate access and remove dev fallback.
     - File: `frontend/src/App.jsx`.

- Manmeet
  3.1) Events list → GET API
     - Replace mocks with `GET /api/events`; add `loading`, `error`, and `empty` states; keep client-side search/category filtering.
     - Map API fields to card props: `id,title,category,description,imageUrl,slotsAvailable/Total (optional)`.
     - File: `frontend/src/pages/Events/EventsPage.jsx`.
  3.2) EventCard compatibility
     - Ensure `EventCard` accepts the API event shape; wrap with `<Link to={`/events/${event.id}`}>` for details.
     - File: `frontend/src/pages/Events/EventCard.jsx`.
  3.3) Create Event submit → POST API
     - Use existing form state to POST `/api/events`; construct `date`, `startTime`, `endTime`, and numeric `capacity`.
     - On success: show success UI, reset form, keep on page; on error: show inline message.
     - File: `frontend/src/pages/Events/CreateEventPage.jsx`.
  3.4) Create Event auth check
     - Ensure only organizer can access `/events/create`; else redirect to `/events`.
     - File: `frontend/src/pages/Events/CreateEventPage.jsx`.

- Selena
  4.1) Event Details → GET by ID
     - Use `useParams()` to get `id`, fetch `GET /api/events/:id`, replace mock object, and render dynamic data.
     - File: `frontend/src/pages/Events/EventDetails.jsx`.
  4.2) Loading/404/error states
     - Add skeleton while loading; show “not found” if 404; display error message on fetch failure with retry.
     - File: `frontend/src/pages/Events/EventDetails.jsx`.
  4.3) Verify role-driven UI gates
     - Use stored `{user,token}` to render volunteer RSVP/save, organizer edit/delete placeholders, and admin status chip; remove dev fallback.
     - File: `frontend/src/pages/Events/EventDetails.jsx`.
  4.4) Admin approve/deny actions
     - Wire buttons to `POST /api/admin/events/:id/approve|deny`; on success set local status to returned value; handle error inline.
     - File: `frontend/src/pages/Events/EventDetails.jsx`.
