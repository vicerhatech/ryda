# Student 1 Tasks — Identity & Driver Onboarding

## Ownership

You exclusively own:

```text
client/src/features/identity/**
server/src/modules/identity/**
```

Do not edit captain-owned integration/shared files. If wiring is needed, report it.

Recommended branch:

```bash
git switch integration
git pull origin integration
git switch -c student-1/identity
```

---

# S1-T01 — Identity Module Skeleton

## Goal
Create the feature-local folder structure and exports for Ryda identity without wiring root application files.

## Backend
Create appropriate folders for:
- models
- controllers
- services
- routes
- validation

## Frontend
Create appropriate folders for:
- pages
- components
- api
- hooks/context if needed
- feature export/index

## Acceptance criteria
- Feature folders are coherent.
- No global files are modified.
- Module can later export an Express router.
- Frontend can later export identity-related route/page components.

Stop and provide the task report.

---

# S1-T02 — User Authentication Backend

## Goal
Implement backend registration/login/current-user functionality.

## Requirements
- `User` model follows README contract.
- Roles allowed: `RIDER`, `DRIVER`, `ADMIN`.
- Public registration must not allow a normal user to self-register as `ADMIN`.
- Hash password with bcrypt.
- JWT authentication.
- Implement:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Use feature-local route paths; captain will mount `/api`.
- Validate required fields.
- Never return password hash.

## Shared dependency
Use the captain-provided auth middleware/utilities where available. If mounting is required, report it instead of editing `server/src/app.js`.

Stop and report.

---

# S1-T03 — Authentication Frontend

## Goal
Build Ryda login/register experience.

## Required screens/components
- Login
- Register
- account type choice: Rider or Driver
- auth persistence appropriate for MVP
- loading/error handling
- logout control owned inside the feature

## Rules
- Use existing shared components if available.
- Do not modify global navigation.
- Do not create admin self-registration.
- Use `VITE_API_URL`.

## Acceptance criteria
- UI can call documented auth endpoints.
- Successful login persists session token in the project's chosen MVP mechanism.
- Feature exposes what the captain must mount into AppRoutes.

Stop and report.

---

# S1-T04 — User Profile

## Goal
Implement basic profile view/edit support.

## Backend
- `PATCH /api/profile`
- allow safe editable fields only.

## Frontend
- profile page
- update name/phone/profile image where implemented
- Cloudinary integration may be used for profile image.

## Security
Do not allow role changes from this endpoint.

Stop and report.

---

# S1-T05 — Driver Verification Submission

## Goal
Allow DRIVER users to submit Keke verification details.

## Data
Create `DriverProfile` using README contract:
- userId
- vehicleType fixed to `KEKE`
- vehicle number
- vehicle image
- identity document
- verification status
- online/suspension/location/rating fields as appropriate

## API
- `POST /api/driver-verification`
- `GET /api/driver-verification/me`

## Frontend
Build:
- driver verification form
- image/document upload
- status view: PENDING / APPROVED / REJECTED

## Rules
- Initial status is `PENDING`.
- Driver cannot approve themselves.
- Do not build admin approval UI here; that belongs to Student 4.
- Cloudinary setup instructions should be explained to the student if credentials/configuration are missing.

Stop and report.

---

# S1-T06 — Identity Feature Validation & Handoff

## Goal
Make the identity module ready for captain integration.

## Required work
- test register/login/me/profile/driver-verification paths;
- verify no password hash leaks;
- verify invalid role registration is rejected;
- verify duplicate email handling;
- verify feature exports;
- document exact backend router export;
- document exact frontend components/routes the captain must mount.

## Do not
- modify `AppRoutes`;
- modify root Express mounting;
- merge branches yourself unless instructed.

Stop and provide a detailed handoff report.
