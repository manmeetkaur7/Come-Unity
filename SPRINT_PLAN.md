**Sprint Overview**
- We already have the UI for login/signup, events, and dashboards; this sprint’s goal is to connect that UI to a real backend API.
- By the end, users should be able to register/log in, see events from the database, create new events (organizers), and approve/deny events (admins).

**Setup (everyone)**
- 1) Pull and install
  - From the main branch: `git pull` to get the latest `main`.
  - For this setup step (installing deps and fixing local `.env` files) you can stay on `main` (only editing local files so you don't need a new branch yet).
  - Once your local setup is working, create a feature branch when you start on an actual story/subtask.
  - Backend deps: from `mern-stack/` run `npm install` (this picks up the new backend packages: `cors`, `bcryptjs`, `jsonwebtoken`).
- 2) Backend env (`mern-stack/.env`)
  - You already have this file with `MONGO_URI` set. Keep that value, but add the missing lines.
  - You can also reference `mern-stack/.env.example` to see the latest layout.
  - Open `mern-stack/.env` and ensure it contains:
    - `MONGO_URI=...` — your MongoDB Atlas URI (already there).
    - `JWT_SECRET=...` — choose a long random string (this signs/verifies JWTs).
      - Example command to generate one (from `mern-stack/`):
        - `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    - `PORT=5001` — dev backend port.
    - `CLIENT_ORIGIN=http://localhost:5173` — Vite dev URL.
- 3) Frontend env (`mern-stack/frontend/.env.local`)
  - This file does not exist yet; create it from the example: from `mern-stack/frontend/` run `cp .env.local.example .env.local` and use that example as your template.
  - Open `.env.local` and set:
    - `VITE_API_URL=http://localhost:5001`.
- 4) Run the apps
  - Backend: from `mern-stack/` run `npm run dev` → you should see Mongo connect and `Server started at http://localhost:5001`. Check `http://localhost:5001/api/health` (check browser while server running) for `{ "status": "ok" }`.
  - Frontend: from `mern-stack/frontend/` run `npm run dev` → open `http://localhost:5173` (should already be working from before).

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

**Key Terms (high-level-overview)**
- Backend / Node server
  - The code running on Node.js that listens on a port (like `http://localhost:5001`) and talks to the database.
  - It receives HTTP requests (like “get events”) and sends back responses (usually JSON).
- Frontend
  - The React app in the browser (at `http://localhost:5173`) that users see and click on.
  - It sends requests to the backend and shows the results on the screen.
- API
  - A set of URLs the frontend can call on the backend, usually starting with `/api/...`.
  - Example: `GET /api/events` is an API that returns a list of events as JSON.
- Endpoint
  - One specific URL + method on the backend.
  - Example: `POST /api/auth/login` is the “login endpoint”.
- HTTP methods (GET vs POST)
  - `GET` — ask for data (no body). Example: `GET /api/events` returns events.
  - `POST` — send data to create something. Example: `POST /api/events` creates a new event.
  - (Later we may use `PATCH`/`DELETE` to update or delete things.)
- Auth (Authentication & Authorization)
  - Authentication = “who are you?” (logging in with email/password).
  - Authorization = “what are you allowed to do?” (e.g. organizer vs volunteer vs admin).
  - In this sprint, auth is handled with email/password + JWT tokens + user roles.
- JWT / token
  - JWT = JSON Web Token, a signed string the backend gives you after login.
  - The frontend stores the token (e.g. in `localStorage`) and sends it with requests so the backend knows who is calling.
- Env vars (`.env`, `.env.local`)
  - Config values stored outside the code, like `MONGO_URI`, `JWT_SECRET`, `PORT`, `VITE_API_URL`.
  - On the backend, `dotenv` loads `.env` into `process.env`.
  - On the frontend, Vite loads `.env.local` and exposes variables starting with `VITE_`.
- Model (Mongoose)
  - A JS object that represents a type of data in MongoDB, like `User` or `Event`.
  - We define fields and types (e.g. `title`, `date`, `category`), then call things like `Event.find()` or `Event.create()`.

**Stories and Subtasks (Outline)**
Story CU-3: Backend MVP
- CU-20 Auth endpoints + JWT (Aric)
- CU-21 Events endpoints (list/detail/create) (Aric)
- CU-37 Admin approvals endpoints (Aric)
- CU-38 API spec + seeds + env (Aric)

Story CU-4: FE Auth Integration
- CU-34 API client + token storage (Jonathan)
- CU-35 Wire Login (Jonathan)
- CU-36 Wire Signup (Jonathan)
- CU-66 Protected routes + useAuthUser (Jonathan)

Story CU-12: Events List/Create Integration
- CU-22 Events list → GET API (Manmeet)
- CU-23 EventCard compatibility (Manmeet)
- CU-24 Create Event submit → POST API (Manmeet)
- CU-25 Create Event auth check (Manmeet)

Story CU-13: Event Details + Admin Actions
- CU-30 Event Details → GET by ID (Selena)
- CU-31 Loading/404/error states (Selena)
- CU-32 Verify role-driven UI gates (Selena)
- CU-33 Admin approve/deny actions (Selena)

**Order Of Work (Phases)**
- Phase 1 — Aric: finish backend foundation (Story CU-3: CU-20–CU-37)
  - Aric finishes first: CU-20 → CU-21 → CU-37.
  - Once CU-20–CU-37 are done, the backend has:
    - Auth endpoints (login/register + JWT).
    - Events endpoints (list/detail/create).
    - Admin approve/deny endpoints.

- Phase 2 — After CU-20–CU-37 are done, others can start
  - Jonathan (Story CU-4: CU-34–CU-66)
    - Can start all of CU-34, CU-35, CU-36, CU-66.
    - Depends on: CU-20 (Auth endpoints) so login/signup actually talk to the backend.
  - Manmeet (Story CU-12: CU-22–CU-24)
    - Can start: CU-22 Events list → GET API, CU-23 EventCard compatibility, CU-24 Create Event submit → POST API.
    - Should wait on: CU-25 Create Event auth check until Jonathan finishes all of Story CU-4 (subtasks CU-34–CU-66), so there is a real logged-in user with a `role` instead of the dev fallback.
    - Depends on: CU-21 (Events endpoints).
  - Selena (Story CU-13: CU-30, CU-31, CU-33)
    - Can start: CU-30 Event Details → GET by ID, CU-31 loading/404/error states, CU-33 Admin approve/deny actions.
    - Should wait on: CU-32 Verify role-driven UI gates until Jonathan finishes all of Story CU-4 (subtasks CU-34–CU-66).
    - Depends on: CU-21/CU-37 (Events + admin endpoints).

- Phase 3 — Aric: documentation and seeds (Story CU-3: CU-38)
  - After CU-21 and CU-37 are stable, Aric can work on CU-38 (API spec + seeds + env) in parallel with the others.
  - Doesn’t gate the team, but makes their work easier by documenting request/response shapes and seeding some sample users/events.

**By Person (numbered subtasks)**
- Aric
  CU-20) Auth endpoints + JWT
     - Goal: let a user register and log in, and get back a token + role that the frontend can use.
     - What to do:
       - Create a `User` model in `backend/models/User.js` with fields: `firstName`, `lastName`, `email` (unique), `passwordHash`, `role` (`"organizer"` or `"volunteer"`; you can set admins manually for now).
       - Add an `auth` middleware file `backend/middleware/auth.js` that:
         - Reads the `Authorization` header, verifies the JWT using `JWT_SECRET`, and attaches `req.user = { id, role }` if valid.
         - Exports a `requireRole(role)` helper that checks `req.user.role`.
       - Add an `auth` routes file `backend/routes/auth.js` that defines:
         - `POST /api/auth/register` — read email/password/role from `req.body`, hash the password with `bcryptjs`, create the user in MongoDB, and return a simple success message (you can log them in immediately or require them to use the login endpoint; either is fine for this sprint).
         - `POST /api/auth/login` — look up by email, compare password with `bcryptjs.compare`, and if valid, sign a JWT with `jsonwebtoken` that includes the user id and role.
       - Wire these routes into `backend/server.js` (e.g., `app.use("/api/auth", authRouter);`) and make sure `app.use(express.json())` and `cors(...)` are already set up (they are).
     - Expected responses:
       - On successful login: `{ token, user: { id, email, role } }`.
       - On errors (bad password, email not found, etc.): return a 400 or 401 with `{ error: { message: "Something went wrong" } }`.
  CU-21) Events endpoints (list/detail/create)
     - Goal: store events in MongoDB and let the frontend list them, view details, and create new ones.
     - What to do:
       - Create an `Event` model in `backend/models/Event.js` with fields such as: `title`, `description`, `category`, `date`, `startTime`, `endTime`, `address`, `capacity`, `imageUrl`, `status` (`"pending"`, `"approved"`, `"denied"`), and `owner` (ObjectId of the `User` who created it).
       - Create an `events` routes file `backend/routes/events.js` that defines:
         - `GET /api/events` — return only events with `status: "approved"` sorted by date. Shape: `{ events: [ ... ] }`.
         - `GET /api/events/:id` — return one event by id. Shape: `{ event: { ... } }`. If not found, send 404.
         - `POST /api/events` — protected by `auth` + `requireRole("organizer")`; create a new event with `status: "pending"` and `owner` equal to the logged-in user’s id.
       - Mount the routes in `backend/server.js` (e.g., `app.use("/api/events", eventsRouter);`).
       - Keep validation simple: require at least `title`, `description`, `date`, and `category`; respond with a 400 and a message if missing.
     - Expected responses:
       - `GET /api/events`: `{ events: [ { id, title, ... }, ... ] }`.
       - `GET /api/events/:id`: `{ event: { id, title, ... } }` or a 404.
       - `POST /api/events`: 201 status with `{ event: { ... } }` for the created event.
  CU-37) Admin approvals endpoints
     - Goal: give admins a simple way to approve or deny pending events.
     - What to do:
       - Create an `admin` routes file `backend/routes/admin.js`.
       - Add two routes that are both protected by `auth` + `requireRole("admin")`:
         - `POST /api/admin/events/:id/approve` — find the event by id and set `status = "approved"`.
         - `POST /api/admin/events/:id/deny` — find the event by id and set `status = "denied"`.
       - If an event isn’t found, return a 404 with `{ error: { message: "Event not found" } }`.
       - Mount the routes in `backend/server.js` (e.g., `app.use("/api/admin", adminRouter);`).
     - Expected responses:
       - Both endpoints can return `{ event: { ...updated event... } }` on success.
  CU-38) API spec + seeds + env
     - Goal: document the API for the team and provide some sample data for local testing.
     - What to do:
       - Create `mern-stack/API_SPEC.md` describing, for each endpoint:
         - URL and method (e.g., `POST /api/auth/login`).
         - Required headers (e.g., `Authorization: Bearer <token>` for protected routes).
         - Example request body and example response JSON.
       - Create a simple seed script `backend/scripts/seed.js` that:
         - Connects to MongoDB using `connectDB()`.
         - Clears out the relevant collections (optional, if you want).
         - Inserts at least: 1 organizer user, 1 volunteer user, 2 approved events, 1 pending event (owned by the organizer).
       - In the README or API spec, show how to run it (e.g., `node backend/scripts/seed.js`).

- Jonathan
  CU-34) API client + token storage
     - Goal: have one place in the frontend that knows how to call the backend API and attach the token.
     - What to do:
       - Create `frontend/src/lib/api.js`.
       - Inside it, read the base URL from `import.meta.env.VITE_API_URL`.
       - Write a helper like `request(path, { method = "GET", body } = {})` that:
         - Builds the full URL: `baseUrl + path`.
         - Reads `localStorage.getItem("user")`, parses it, and if there is a `token`, adds `Authorization: Bearer <token>` to the headers.
         - Sets `Content-Type: "application/json"` when there is a body and `JSON.stringify` the body.
        - Calls `fetch`, checks `res.ok`, throws a JavaScript `Error` with a message if not ok, and returns `await res.json()` if ok.
       - Optionally export helpers like `get`, `post` that call `request` with the right method.
     - This file will be imported by the login, signup, events, and details pages so they all share the same logic.
     - Remember to import this helper where needed:
       - `frontend/src/pages/Auth/LoginPage.jsx`
       - `frontend/src/pages/Auth/SignupPage.jsx`
       - `frontend/src/pages/Events/EventsPage.jsx`
       - `frontend/src/pages/Events/EventDetails.jsx`
  CU-35) Wire Login
     - Goal: replace the current “alert” with a real login that calls the backend and stores the user.
     - What to do:
       - Open `frontend/src/pages/Auth/LoginPage.jsx`.
       - In the `handleSubmit`, instead of calling `alert`, use the `api` helper from 2.1 to:
         - Send `POST` to `/api/auth/login` with `{ email, password }` from the form inputs.
         - On success, save the returned `{ token, user }` to `localStorage` under the key `"user"` using `JSON.stringify`.
       - After saving, redirect based on `user.role`:
         - `"admin"` → `/dashboard/admin`
         - `"organizer"` → `/dashboard/organizer`
         - `"volunteer"` (or anything else) → `/dashboard/volunteer`
       - On error (e.g., wrong password), show a friendly error message somewhere on the form instead of an alert.
  CU-36) Wire Signup
     - Goal: make the signup form actually create a user account via the backend.
     - What to do:
       - Open `frontend/src/pages/Auth/SignupPage.jsx`.
       - In the `handleSubmit`, instead of the current alert:
         - Call `api.post("/api/auth/register", { firstName, lastName, email, password, role })` with values from the form.
         - On success, either:
           - Show a success message and navigate back to `/` (the Sign In page), or
           - Automatically log them in by calling the login endpoint (optional).
       - Show basic inline error text if the API responds with an error (e.g., email already in use).
       - Keep the existing front-end checks like “role must be selected”.
  CU-66) Protected routes + useAuthUser
     - Goal: make sure only logged-in users can see protected pages, and that their role is read from real data.
     - What to do:
       - Open `frontend/src/App.jsx`.
       - Update `useAuthUser` so it:
         - Reads `localStorage.getItem("user")`.
         - Parses it and returns the `user` object (or `null` if not present).
       - Update `ProtectedRoute` so it:
         - Checks `useAuthUser()` and, if there is no user, redirects to `/` (Sign In).
         - Removes any “dev fallback” user (like `{ role: "volunteer" }`).
       - Make sure the `App` component passes the `user` object down to pages that need to know the role (events, dashboards, etc.).

- Manmeet
  CU-22) Events list → GET API
     - Goal: make the Events page show real events from the backend instead of the hard-coded list.
     - What to do:
       - Open `frontend/src/pages/Events/EventsPage.jsx`.
       - Replace the current mock `events` array with React state (this is probably already there) that is filled by:
         - Using `useEffect` to call `api.get("/api/events")` when the component mounts (import the helper from `frontend/src/lib/api.js`).
         - While loading, show a “Loading events…” state instead of the grid.
         - If the request fails, show a friendly error message and maybe a “Try again” button.
       - Keep the existing search and category filtering logic, but apply it to the events from the API.
     - Data mapping:
       - Make sure each event from the API has the fields needed by `EventCard` (`id`, `title`, `category`, `description`, `imageUrl`, and any slots/count info you want to surface).
  CU-23) EventCard compatibility
     - Goal: make sure clicking an event card takes you to the correct details page using the event’s id.
     - What to do:
       - Open `frontend/src/pages/Events/EventCard.jsx`.
       - Ensure the component expects an `event` prop with at least: `id`, `title`, `category`, `description`, `imageUrl`.
       - Wrap the clickable area in a React Router `<Link>` that goes to `/events/{event.id}`.
       - Confirm that any optional fields (like slots or status) are handled gracefully if they’re missing.
  CU-24) Create Event submit → POST API
     - Goal: hook up the Create Event form so it actually sends data to the backend.
     - What to do:
       - Open `frontend/src/pages/Events/CreateEventPage.jsx`.
       - In the existing `handleSubmit`, instead of only logging to the console:
         - Use the `api` helper to send `POST` `/api/events` with a JSON body built from the form fields (name/title, description, date, times, category, etc.) — import it from `frontend/src/lib/api.js`.
         - For now, skip file uploads; either send an empty `imageUrl` or some placeholder string.
       - On success:
         - Show the existing success message.
         - Reset the form to its default state.
       - On error:
         - Show the error message in the same area as the success/error status text.
  CU-25) Create Event auth check
     - Goal: only logged-in organizers should be able to create events.
     - What to do:
       - Still in `CreateEventPage`, use the `user` prop (or `useAuthUser` from 2.4) to check the role.
       - If there is no user or the role is not `"organizer"`, immediately redirect to `/events` (e.g., using `<Navigate>` from React Router).
       - If the user is an organizer, show the form as normal.

- Selena
  CU-30) Event Details → GET by ID
     - Goal: show real event information on the Event Details page based on the id in the URL.
     - What to do:
       - Open `frontend/src/pages/Events/EventDetails.jsx`.
       - Use `useParams()` from React Router to get the `id` from the URL.
       - Replace the hard-coded `mockEvent` with state that is filled by calling `api.get("/api/events/" + id)` in a `useEffect` (import the helper from `frontend/src/lib/api.js`).
       - If the fetch succeeds, store the event in state and use that state everywhere the mock event was used before.
       - If the event is not found (404), set a “not found” state so you can show a message instead of the details.
  CU-31) Loading/404/error states
     - Goal: give the user clear feedback while the event is loading, missing, or if something goes wrong.
     - What to do:
       - In the same `EventDetails` component, track three things: loading, error, and not-found.
       - While loading: show a simple loading message or skeleton instead of the full details layout.
       - If an error happens (network or server), show a short error text and optionally a “Try again” button that re-fetches.
       - If the event is not found, show the existing “Event not found” state and a button/link back to `/events`.
  CU-32) Verify role-driven UI gates
     - Goal: make sure volunteers, organizers, and admins see the correct controls on the Event Details page.
     - What to do:
       - Use the real `user` (from `useAuthUser` or the `user` prop) instead of any fallback user.
       - For volunteers:
         - Show the RSVP / hours selection and “Save for later” controls.
       - For organizers:
         - Show the “Edit Event” and “Delete” placeholders only if the logged-in organizer owns the event (based on `event.owner` vs `user.id`).
       - For admins:
         - Show the status chip and admin-only approve/deny controls.
       - Verify that if no user is logged in, none of the privileged controls show and the page still looks reasonable.
  CU-33) Admin approve/deny actions
     - Goal: let admins approve or deny an event directly from the Event Details page.
     - What to do:
       - In `EventDetails`, make the Approve and Deny buttons call:
         - `api.post("/api/admin/events/" + id + "/approve")` or `"/deny"` respectively.
       - Only show these buttons if the logged-in user has `role === "admin"`.
       - After a successful response, update the local `event.status` in state so the UI reflects the new status without a full page reload.
       - If there is an error (e.g., not authorized or server error), show a short inline message near the buttons.
