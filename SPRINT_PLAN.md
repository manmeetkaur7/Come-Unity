**Sprint Overview**
- We already have the UI for login/signup, events, and dashboards; this sprint’s goal is to connect that UI to a real backend API.
- By the end, users should be able to register/log in, see events from the database, create new events (organizers), and approve/deny events (admins).

**Setup (everyone)**
- 1) Pull and install
  - From the repo root: `git pull` to get the latest `main`.
  - For this setup step (installing deps and fixing local `.env` files) you can stay on `main` (only editing local files so you don't need a new branch).
  - Once your local setup is working, create a feature branch when you start on an actual story/subtask.
  - Backend deps: from `mern-stack/` run `npm install` (this picks up the new backend packages: `cors`, `bcryptjs`, `jsonwebtoken`).
- 2) Backend env (`mern-stack/.env`)
  - You already have this file with `MONGO_URI` set. Keep that value, but add the missing lines.
  - You can also reference the .env.example file to see the new layout.
  - Open `mern-stack/.env` and ensure it contains:
    - `MONGO_URI=...` — your MongoDB Atlas URI (already there).
    - `JWT_SECRET=...` — choose a long random string (this signs/verifies JWTs).
      - Example command to generate one (from `mern-stack/`):
        - `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    - `PORT=5001` — dev backend port.
    - `CLIENT_ORIGIN=http://localhost:5173` — Vite dev URL.
- 3) Frontend env (`mern-stack/frontend/.env.local`)
  - If you don’t have one yet: from `mern-stack/frontend/` run `cp .env.local.example .env.local`.
  - Open `.env.local` and set:
    - `VITE_API_URL=http://localhost:5001` (or whatever your backend URL/port is).
- 4) Run the apps
  - Backend: from `mern-stack/` run `npm run dev` → you should see Mongo connect and `Server started at http://localhost:5001`. Check `http://localhost:5001/api/health` for `{ "status": "ok" }`.
  - Frontend: from `mern-stack/frontend/` run `npm run dev` → open `http://localhost:5173`.

**Dependencies (high-level overview)**
- Backend libraries
  - `express` — web framework that powers our Node server (handles routes like `/api/events`).
  - `mongoose` — helper on top of MongoDB so we can define `User` and `Event` models instead of dealing with raw documents.
  - `mongodb` — low-level MongoDB driver that `mongoose` uses under the hood.
  - `dotenv` — reads the `.env` file and loads values like `MONGO_URI` and `JWT_SECRET` into `process.env`.
  - `cors` — lets our backend explicitly allow requests from the frontend URL (otherwise the browser will block them).
  - `bcryptjs` — hashes passwords before saving them and checks hashes on login (never store plain-text passwords).
  - `jsonwebtoken` — creates and verifies JWT tokens so the backend can remember “who you are” between requests.
  - `nodemon` — dev-only helper that restarts the Node server automatically when backend files change.
- Frontend tools
  - `vite` — dev server/bundler that runs the React app on `http://localhost:5173` and hot-reloads on changes.
  - `react`, `react-router-dom`, `@chakra-ui/react`, etc. — already in the frontend; used for UI and routing.

**Stories and Subtasks (Outline)**

(numbers just for this doc, not Jira #s)
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

**Order Of Work (Phases)**
- Phase 1 — Backend Auth foundation (Aric)
  - Build `POST /api/auth/register` and `POST /api/auth/login` with JWT + bcryptjs; add CORS/JSON middleware and auth/role middleware.
  - Output includes `{ token, user: { id, email, role } }`.
  - Unblocks: Jonathan’s Login/Signup and ProtectedRoute work.

- Phase 2 — Events domain (Aric)
  - Event model and routes: `GET /api/events` (approved), `GET /api/events/:id`, `POST /api/events` (organizer → pending).
  - Simple query params `?q=&category=` optional; FE can still filter client-side.
  - Unblocks: Manmeet’s Events list and Create submit; Selena’s Details fetch.

- Phase 3 — FE Auth wiring (Jonathan)
  - Implement `api.js` helper, wire Login/Signup to backend, persist `{token,user}` in localStorage, guard routes.
  - After this, Manmeet/Selena can rely on stored auth for organizer/admin gating.

- Phase 4 — FE Events integrations (Manmeet)
  - Replace mock list with `GET /api/events` and wire Create submit to `POST /api/events` (organizer only).
  - Keep existing client search/filter; no image upload; `imageUrl` can be empty.

- Phase 5 — Admin actions (Selena)
  - Fetch event by id and wire admin approve/deny to `POST /api/admin/events/:id/{approve|deny}`; update status chip live.

- Finalization — API spec + seeds (Aric, can be parallel after Phase 2)
  - Document request/response shapes; add small seed script for 1 organizer, 1 volunteer, a few events (2 approved, 1 pending).

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
