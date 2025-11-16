# Come-Unity API Spec (CU-20 / CU-21 / CU-37)

## Base URL
- Local dev: `http://localhost:5001`
- All JSON requests should set `Content-Type: application/json`.
- Protected endpoints require `Authorization: Bearer <token>`.

## Auth
### POST /api/auth/register
- Purpose: create a new user account.
- Body: `firstName`, `lastName`, `email`, `password`, `role` (`organizer` | `volunteer` | `admin`)
- Success: `201 { "message": "Account created. Please sign in." }`
- Errors: `400 { error: { message } }` (missing fields, email taken), `500` server error.

### POST /api/auth/login
- Purpose: log in and receive a JWT + user info.
- Body: `email`, `password`
- Success: `200 { "token": "...", "user": { "id", "email", "role", "firstName", "lastName" } }`
- Errors: `400/401 { error: { message } }` (invalid credentials), `500` server error.

## Events
### GET /api/events
- Purpose: list approved events (public).
- Auth: none.
- Success: `200 { "events": [ { id, title, description, category, date, ... } ] }`

### GET /api/events/:id
- Purpose: get details for a single event.
- Auth: not required for approved events. Pending/denied are only visible to owner or admin if a valid token is provided.
- Success: `200 { "event": { ... } }`
- Errors: `404 { error: { message: "Event not found" } }`

### POST /api/events
- Purpose: create a new event (organizers only).
- Auth: required (`Authorization: Bearer <token>`), role must be `organizer`.
- Body (minimal required): `title`, `description`, `category`, `date` (ISO string). Optional: `startTime`, `endTime`, `address`, `capacity`, `imageUrl`.
- Behavior: creates event with `status: "pending"` and `owner` = logged-in user.
- Success: `201 { "event": { ... } }`
- Errors: `400 { error: { message } }` (missing fields), `401/403` if not authorized, `500` server error.

## Admin
### POST /api/admin/events/:id/approve
### POST /api/admin/events/:id/deny
- Purpose: allow admins to moderate events.
- Auth: required (`Authorization: Bearer <token>`), role must be `admin`.
- Success: `200 { "event": { ...updated event... } }`
- Errors: `404 { error: { message: "Event not found" } }`, `401/403` if not authorized, `500` server error.

---

## Quick curl examples (local)
Replace emails/passwords as needed.

Register:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"pw12345","role":"volunteer"}'
```

Login (captures token):
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pw12345"}'
```

List events:
```bash
curl http://localhost:5001/api/events
```

Create event (organizer token required):
```bash
TOKEN="<organizer token from login>"
curl -X POST http://localhost:5001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My Event","description":"Desc","category":"Health","date":"2025-02-15","startTime":"09:00 AM","endTime":"11:00 AM","address":"123 Main St","capacity":25,"imageUrl":""}'
```

Approve event (admin token required):
```bash
ADMINTOKEN="<admin token>"
EVENT_ID="<pending event id>"
curl -X POST http://localhost:5001/api/admin/events/$EVENT_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMINTOKEN"
```
