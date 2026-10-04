# Student 2 Tasks — Ride Booking, Maps & Live Ride Tracking

## Ownership

You exclusively own:

```text
client/src/features/rides/**
server/src/modules/rides/**
```

Recommended branch:

```bash
git switch integration
git pull origin integration
git switch -c student-2/rides
```

Do not modify shared/root routing files. Report integration needs to the captain.

---

# S2-T01 — Ride Module Skeleton & Model

## Goal
Create the ride vertical module and `Ride` model.

## Required fields
Follow the README Ride contract.

## Validation rules
- bookedSeats must be integer 1–4.
- `isPrivateRide = bookedSeats === 4`.
- gross fare must be calculated on backend:
  - seats × ₦150
- platform fee:
  - 10% of gross
- driver net:
  - gross - platform fee
- never trust price values from the browser.

Stop and report.

---

# S2-T02 — Rider Creates and Views Ride Requests

## Goal
Implement rider booking APIs.

## Endpoints
- `POST /api/rides`
- `GET /api/rides/:id`
- `GET /api/rides/my`
- `PATCH /api/rides/:id/cancel`

## Requirements
Ride request includes:
- pickup address + coordinates
- destination address + coordinates
- seat count

New ride:
- status = `REQUESTED`
- paymentStatus = `PENDING`

Cancellation must obey sensible MVP rules:
- allow before trip begins;
- if an accepted unpaid ride is legitimately cancelled, communicate that its platform-fee liability should be waived by payments module;
- do not directly implement payment module logic.

Stop and report.

---

# S2-T03 — Rider Booking UI & Seat Selection

## Goal
Build the rider booking page.

## UI
- pickup
- destination
- 1/2/3/4 seat selector
- explanatory label for 4 seats: `Private Keke`
- fare preview
- platform payment notice
- request button

## Pricing display
- 1 = ₦150
- 2 = ₦300
- 3 = ₦450
- 4 = ₦600

Frontend calculation is display-only. Backend remains authoritative.

## Warning
Show the approved Ryda off-platform payment warning from README.

Stop and report.

---

# S2-T04 — Driver Accepts Ride & Ride Status Machine

## Goal
Implement ride acceptance and operational status changes.

## Endpoints
- `POST /api/rides/:id/accept`
- `PATCH /api/rides/:id/status`

## Requirements
- only an eligible DRIVER may accept;
- only one driver can claim a ride;
- use an atomic backend update or equivalent concurrency-safe check;
- on accept:
  - set driverId
  - set status `ACCEPTED`
  - set acceptedAt
  - set paymentDeadlineAt = acceptedAt + 60 minutes
- only assigned driver can move operational status;
- enforce valid transitions.

## Valid main transitions
```text
REQUESTED
→ ACCEPTED
→ DRIVER_ARRIVING
→ DRIVER_ARRIVED
→ IN_PROGRESS
→ COMPLETED
```

Alternative terminal states:
```text
CANCELLED
NO_SHOW
```

## Dependency
Driver eligibility may rely on Student 3/4 APIs/shared checks. Do not recreate their feature. Use README contract and report any wiring required.

Stop and report.

---

# S2-T05 — Map & Route UI

## Goal
Create ride map components.

## Technology
- Leaflet / React-Leaflet
- OpenStreetMap tiles
- OpenRouteService where useful

## Features
- pickup marker
- destination marker
- route line
- driver marker when active
- appropriate map bounds

## Rules
- keep tile attribution visible;
- do not hardcode an API key;
- if OpenRouteService key is missing, explain setup rather than inserting a secret.

Stop and report.

---

# S2-T06 — Socket.IO Live Tracking for Active Ride

## Goal
Track the assigned Keke from acceptance until destination/completion.

## Room
```text
ride:{rideId}
```

## Events
```text
driver:location:update
ride:location:update
ride:accepted
ride:status:update
```

## Requirements
- assigned driver publishes browser geolocation;
- server validates driver is assigned to that active ride;
- rider subscribes to the ride room;
- driver marker updates without full page refresh;
- tracking remains active during:
  - ACCEPTED
  - DRIVER_ARRIVING
  - DRIVER_ARRIVED
  - IN_PROGRESS
- tracking stops after terminal state.
- no permanent detailed location history is required.

## Shared dependency
If root Socket.IO registration is captain-owned, export a feature socket registration function and report the exact captain wiring step instead of editing `server/src/server.js`.

Stop and report.

---

# S2-T07 — Ride History & Review

## Goal
Complete rider post-trip experience.

## Requirements
- rider history page
- completed ride details
- review endpoint: `POST /api/rides/:id/review`
- 1–5 star rating
- optional comment
- only rider who owns a completed ride can review
- prevent duplicate review for same ride

If average driver rating requires another module to consume review data, expose/report the value contract without editing that module.

Stop and report.

---

# S2-T08 — Ride Feature Validation & Handoff

## Goal
Prepare rides for integration.

## Verify
- all seat values;
- prices;
- private ride flag;
- atomic acceptance;
- status transitions;
- cancellation path;
- route/map rendering;
- live location from acceptance through trip completion;
- rider history;
- review authorization.

## Handoff
Report:
- Express router export
- socket registration export
- frontend page/component exports
- required routes for `AppRoutes`
- any payment/driver-eligibility calls required from other modules

Stop and report.
