# Student 3 Tasks — Courier & Driver Operations

## Ownership

You exclusively own:

```text
client/src/features/courier/**
client/src/features/driver-ops/**
server/src/modules/courier/**
server/src/modules/driverOps/**
```

Recommended branch:

```bash
git switch integration
git pull origin integration
git switch -c student-3/courier-driver
```

Do not edit rides, payments, admin, identity or captain-owned root files.

---

# S3-T01 — Driver Availability & Driver Dashboard Core

## Goal
Create driver operations module.

## Endpoints
- `PATCH /api/driver/availability`
- `GET /api/driver/dashboard`
- `GET /api/driver/requests`

## Availability rules
A driver may be online only if:
- verification is APPROVED;
- not suspended;
- no overdue platform fee.

If overdue-fee lookup belongs to Student 4 and is unavailable on this branch, create the integration boundary documented in README and report the dependency. Do not recreate payment models.

## Dashboard should expose
- online/offline status
- verification state
- active assignment summary
- completed ride/courier counts where data is available
- wallet/liability slots using documented contracts

Stop and report.

---

# S3-T02 — Driver Operations UI

## Goal
Build the driver dashboard shell owned by this feature.

## Required UI
- verification state
- online/offline toggle
- available request list
- active assignment card
- clear blocked-state message if suspended/unverified/overdue

Do not build wallet internals; Student 4 owns payments. Provide a slot/link contract for integration.

Stop and report.

---

# S3-T03 — Courier Model & Create/View APIs

## Goal
Create the campus courier vertical module.

## Model
Follow `CourierDelivery` contract in README.

## Endpoints
- `POST /api/courier`
- `GET /api/courier/:id`
- `GET /api/courier/my`
- `PATCH /api/courier/:id/cancel`

## Create fields
- recipient name
- recipient phone
- package description
- pickup address + coordinates
- dropoff address + coordinates

## Pricing
- fixed courier fare = configurable ₦150
- fee = 10%
- driver net = 90%
- backend recalculates price.

Stop and report.

---

# S3-T04 — Courier Sender UI

## Goal
Build sender courier screens.

## UI
- create delivery form
- recipient information
- package description
- pickup/dropoff
- fixed fee display
- payment warning
- sender delivery history/detail

Do not create a shopping/item-budget workflow. This is delivery only.

Stop and report.

---

# S3-T05 — Driver Accepts & Progresses Courier

## Goal
Implement driver-side courier operations.

## Endpoints
- `POST /api/courier/:id/accept`
- `PATCH /api/courier/:id/status`

## Acceptance
- only eligible driver;
- only one driver can claim;
- set `acceptedAt`;
- set `paymentDeadlineAt = acceptedAt + 60 minutes`;
- payment initially remains pending until Student 4 payment flow resolves it.

## Main status flow
```text
REQUESTED
→ ACCEPTED
→ PICKED_UP
→ IN_TRANSIT
→ DELIVERED
```

Only assigned driver may progress the delivery.

Stop and report.

---

# S3-T06 — Courier Live Tracking

## Goal
Allow sender to monitor delivery movement.

## Room
```text
courier:{courierId}
```

## Events
```text
courier:location:update
courier:accepted
courier:status:update
```

## Requirements
- assigned driver publishes location;
- server validates ownership;
- sender sees moving marker for active delivery;
- stop tracking at DELIVERED/CANCELLED;
- export socket registration function if captain root wiring is required.

Stop and report.

---

# S3-T07 — Driver Request Feed Integration Boundary

## Goal
Make the driver request feed capable of presenting both ride and courier opportunities without owning the ride module.

## Requirements
- driver-ops UI may consume documented ride and courier endpoints;
- do not modify Student 2 files;
- display service type clearly: `RIDE` or `COURIER`;
- show seat count for rides when returned;
- show pickup/dropoff summary;
- accept buttons call the correct service endpoint;
- if ride endpoints are not yet present locally, keep the adapter isolated and document that integration test is pending.

Stop and report.

---

# S3-T08 — Courier/Driver Feature Validation & Handoff

## Verify
- driver eligibility states;
- online/offline;
- courier creation;
- backend fare calculation;
- one-driver acceptance;
- courier status transitions;
- sender views/history;
- live courier tracking;
- request feed boundaries.

## Handoff
Report router exports, socket exports, frontend exports, and all captain wiring requirements.

Stop and report.
