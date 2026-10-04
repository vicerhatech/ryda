# Student 4 / Captain Tasks — Baseline, Payments, Admin & Integration

## Captain Responsibility

You own:

```text
client/src/features/payments/**
client/src/features/admin/**
server/src/modules/payments/**
server/src/modules/admin/**
client/src/app/**
client/src/shared/**
server/src/app.js
server/src/server.js
server/src/shared/**
root integration/configuration files
```

You are also responsible for final integration, Git conflict resolution, cleanup, deployment and merging `integration` into `main`.

---

# CAP-T00 — Create the Shared Baseline BEFORE Other Branches

## Goal
Create the stable project scaffold all students will branch from.

## Required setup
- root repository structure from README
- `client` Vite React app
- `server` Express app
- Tailwind CSS
- React Router
- Axios
- Mongoose connection utility
- Socket.IO root setup
- shared error utility/middleware
- JWT request authentication middleware that can decode the project token contract
- role guard helper
- shared constants including Ryda pricing/status values
- `.env.example`
- `.gitignore`
- placeholder app/navigation shell
- feature mounting placeholders or documented mounting locations
- install only MVP dependencies

## Shared constants
Must include:
```text
KEKE_SEAT_CAPACITY = 4
RIDE_FARE_PER_SEAT_NGN = 150
COURIER_FARE_NGN = 150
PLATFORM_FEE_RATE = 0.10
PAYMENT_GRACE_PERIOD_MINUTES = 60
```

## Important
Do not implement other students' features.

## Git
When stable:
```bash
git add .
git commit -m "chore: create Ryda MVP baseline"
git push -u origin integration
```

Every student must create their feature branch from this exact `integration` baseline.

Stop and report. Teacher should approve before students branch.

---

# S4-T01 — Payments Models & Ledger

## Goal
Create payment/earning/liability persistence.

## Models
Implement:
- Payment
- DriverWallet
- PlatformFeeLiability
- WithdrawalRequest

Follow README contracts.

## Ledger rules
### Ride
```text
gross = seats × ₦150
fee = 10%
driverNet = 90%
```

### Courier
```text
gross = ₦150
fee = ₦15
driverNet = ₦135
```

## Important
Wallet updates should be done server-side and be idempotent so payment verification cannot credit twice.

Stop and report.

---

# S4-T02 — Paystack Test Payment Initialize & Verify

## Goal
Implement the demo on-platform payment flow.

## Endpoints
- `POST /api/payments/initialize`
- `GET /api/payments/verify/:reference`
- `GET /api/payments/history`

## Requirements
- use Paystack test secret from environment;
- backend determines amount from service record;
- never accept a client-provided trusted amount;
- associate transaction with ride/courier;
- verify reference server-side;
- make verification idempotent;
- mark Payment `PAID`;
- mark related service payment state `PAID`;
- settle related platform fee liability;
- when service completion rules are satisfied, credit driver net earning exactly once.

## Configuration
If keys are missing, explain how the student creates/obtains Paystack test keys and where they go. Never invent keys.

Stop and report.

---

# S4-T03 — One-Hour Liability & Driver Blocking

## Goal
Implement the anti-off-platform-payment rule.

## Logic
When a ride/courier is accepted, payments module must be able to create or ensure a fee liability.

If payment is still not recorded after the one-hour deadline:
- liability becomes `OVERDUE`,
- unless the service is validly `CANCELLED` or `NO_SHOW` and liability should be `WAIVED`.

## Driver eligibility service
Expose a reusable function such as:
```text
getDriverFinancialEligibility(driverId)
```

Return enough information for other modules to determine:
- overdue total;
- whether driver is financially blocked.

## Endpoints
- `GET /api/driver/liabilities`
- `POST /api/driver/liabilities/settle`

## Settlement
Use Paystack test mode.
When all overdue liabilities are settled, eligibility should become unblocked.

## Important
No cron worker is required. Reconcile overdue status on relevant reads/actions.

Stop and report.

---

# S4-T04 — Driver Wallet & Withdrawal Request

## Goal
Implement earnings dashboard APIs and withdrawal requests.

## Endpoints
- `GET /api/driver/wallet`
- `POST /api/driver/withdrawals`
- `GET /api/driver/withdrawals`

## Rules
- driver cannot request more than available balance;
- prevent duplicate balance spending;
- withdrawal request starts `PENDING`;
- no real bank transfer in MVP.

## Frontend
Build:
- wallet summary
- earnings
- platform fees/outstanding liabilities
- withdrawal form
- withdrawal history
- settle outstanding fee action

Stop and report.

---

# S4-T05 — Admin APIs

## Goal
Implement admin management endpoints.

## Required endpoints
- dashboard summary
- users list
- drivers list
- driver verification approve/reject
- suspension/reactivation
- rides list
- courier list
- payments list
- liabilities list
- withdrawals list
- withdrawal approve/reject

## Withdrawal handling
For MVP:
- APPROVED can transition to PAID as a simulated ledger action when the captain chooses the demo behavior;
- REJECTED restores/reserves balance correctly according to chosen ledger design;
- no real bank transfer.

## Security
All endpoints require ADMIN role.

Stop and report.

---

# S4-T06 — Admin Frontend

## Goal
Build the admin dashboard.

## Required areas
- summary metrics
- pending driver verifications
- users
- drivers
- rides
- courier deliveries
- payment records
- overdue liabilities
- withdrawal requests

## Actions
- approve/reject driver
- suspend/reactivate driver
- approve/reject withdrawal

Keep UI functional and simple.

Stop and report.

---

# CAP-T07 — Merge Student 1 Into Integration

## Goal
Integrate identity branch.

## Before merge
```bash
git switch integration
git pull origin integration
git fetch origin
```

Merge:
```bash
git merge --no-ff origin/student-1/identity
```

## Captain work
- resolve conflicts intentionally;
- mount identity backend router;
- add identity pages to AppRoutes;
- add necessary navigation links;
- test registration/login/me/profile/driver verification;
- do not rewrite Student 1's working module merely for style.

## Conflict rule
If a conflict occurs:
1. inspect both versions;
2. preserve baseline shared architecture;
3. preserve student's feature implementation;
4. manually compose only the integration lines needed;
5. run tests/build before committing resolution.

Stop and report.

---

# CAP-T08 — Merge Payments Core / Self-Check

## Goal
Ensure captain-owned payment module is integrated before ride/courier financial integration.

## Work
- mount payment routes;
- integrate Paystack callbacks/verify flow as designed;
- verify wallet/liability APIs;
- verify driver financial eligibility helper is available to driver operations.

Stop and report.

---

# CAP-T09 — Merge Student 2 Into Integration

Merge:
```bash
git switch integration
git pull origin integration
git fetch origin
git merge --no-ff origin/student-2/rides
```

Then:
- mount ride router;
- register ride socket handlers;
- add rider routes/navigation;
- connect ride payment button to Student 4 payment flow;
- connect ride acceptance to liability creation;
- connect ride completion to earning-credit rules;
- connect driver financial eligibility to ride acceptance;
- test 1–4 seat pricing;
- test live tracking through completion.

Stop and report.

---

# CAP-T10 — Merge Student 3 Into Integration

Merge:
```bash
git switch integration
git pull origin integration
git fetch origin
git merge --no-ff origin/student-3/courier-driver
```

Then:
- mount courier and driver-ops routers;
- register courier socket handlers;
- add courier/driver routes/navigation;
- wire request feed to ride/courier APIs;
- connect financial eligibility;
- connect courier payment/liability/earning flow;
- verify live courier tracking.

Stop and report.

---

# CAP-T11 — Full Admin Integration

## Goal
Connect admin feature to the now-integrated identity/ride/courier/payment modules.

## Verify
- pending driver approval works;
- suspend/reactivate works;
- ride/courier tables load;
- payments/liabilities load;
- withdrawal approvals/rejections work;
- dashboard metrics reflect real integrated records.

Stop and report.

---

# CAP-T12 — Conflict Resolution & Project Cleanup

## Goal
Perform the explicit captain cleanup required before main.

## Required work
- inspect `git status`;
- resolve every remaining merge conflict;
- remove accidental duplicate modules/components;
- remove dead imports and obvious unused code;
- ensure no one duplicated shared pricing/status constants;
- ensure there is one authoritative root route configuration;
- ensure there is one authoritative Socket.IO bootstrap;
- ensure no secrets are committed;
- check `.env.example`;
- check README matches implementation;
- fix broken navigation;
- fix broken API base URLs;
- fix CORS/socket origin configuration;
- run client build;
- run server startup/smoke test;
- manually test primary demo flows;
- do not perform a large cosmetic refactor that risks destabilizing the MVP.

## Required final flow checks
1. rider registration/login
2. driver registration/login
3. driver verification approval
4. driver goes online
5. rider books 1 seat
6. rider books 4-seat private Keke
7. driver accepts
8. payment test flow
9. live tracking to destination
10. ride completion
11. wallet credit
12. review
13. courier create/accept/pay/deliver
14. overdue-fee blocking demonstration
15. fee settlement/unblock
16. withdrawal request
17. admin approve/reject

Stop and report all defects found/fixed.

---

# CAP-T13 — Deployment

## Frontend
Deploy to Vercel.

## Backend
Deploy to Render.

## Database
MongoDB Atlas.

## Configure
- production frontend URL
- backend URL
- CORS
- Socket.IO origin
- environment variables
- Cloudinary
- Paystack TEST keys
- OpenRouteService key

## Verify
- deployed frontend can call deployed API;
- sockets connect across HTTPS/WSS;
- map loads;
- payment test flow returns;
- no test secret appears in browser bundle.

Stop and report.

---

# CAP-T14 — Merge Integration Into Main

Only after teacher approval.

Commands:

```bash
git switch integration
git pull origin integration

# final checks here

git switch main
git pull origin main
git merge --no-ff integration
git push origin main
```

If `main` has changed unexpectedly:
- do not force push;
- stop;
- inspect history;
- resolve normally or ask the teacher.

Tagging is optional:

```bash
git tag -a v0.1.0-mvp -m "Ryda MVP demo"
git push origin v0.1.0-mvp
```

Final deliverables:
- main branch clean
- deployed URLs
- demo accounts
- demo script
- known limitations list
- final task report
