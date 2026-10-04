# Ryda — Campus Keke Ride & Courier MVP

## 1. Project Summary

**Ryda** is a MERN-stack campus mobility web application built for university environments where tricycles ("Keke") are a common form of transportation.

The MVP supports two services:

1. **Campus Ride** — a student can book one to four seats in a Keke for a fixed campus fare.
2. **Campus Courier** — a student can request a simple point-to-point package/document delivery to another student or location inside the same campus.

The MVP is intentionally limited to a single-campus operating model. It is designed for demonstration, learning, and future extension rather than production launch.

---

## 2. MVP Product Rules

These rules are project contracts. Agents must not invent alternatives.

### 2.1 Vehicle
- Only **Keke / tricycle** is supported.
- Keke capacity for Ryda bookings is **4 passenger seats**.

### 2.2 Ride pricing
- Fare is **₦150 per seat**.
- A rider may book **1, 2, 3, or 4 seats**.
- Booking all 4 seats is treated as a private Keke booking.
- Examples:
  - 1 seat = ₦150
  - 2 seats = ₦300
  - 3 seats = ₦450
  - 4 seats = ₦600
- The platform fee is **10% of the booking amount**, which is **₦15 per booked seat**.
- Driver earning is the remaining **90%**.
- All pricing values must live in one shared configuration/constants file so that they can be changed later without rewriting business logic.

### 2.3 Courier pricing
For the MVP, campus courier delivery uses a configurable fixed delivery fare:
- Default courier delivery fare: **₦150**
- Platform fee: **10% = ₦15**
- Driver earning: **₦135**
- The sender is paying for delivery only. Ryda is not an errand-shopping marketplace in this MVP.

### 2.4 Payments
- Ryda instructs users to make all ride and courier payments **inside the web application**.
- MVP payments use **Paystack test mode**.
- No real-money bank payout is required for the demo.
- Driver earnings are represented using an internal wallet/ledger.
- Driver withdrawal requests are submitted from the driver dashboard and approved or rejected from the admin dashboard.
- Demo withdrawals are ledger actions only; production bank transfer integration is out of MVP scope.

### 2.5 Off-platform payment warning
Display this message in appropriate payment/booking screens:

> For your safety and transaction traceability, make payments only through Ryda. Payments made outside Ryda cannot be verified through our platform and are not covered by Ryda payment records or dispute support.

Do not invent a stronger legal disclaimer without review.

### 2.6 One-hour anti-bypass rule
When a driver accepts a booking:
1. The booking receives `acceptedAt`.
2. A payment deadline is set to `acceptedAt + 1 hour`.
3. The passenger should pay in-app.
4. A platform-fee liability is associated with the booking.
5. If in-app payment is verified, the liability is automatically settled from the transaction.
6. If no in-app payment is recorded by the deadline and the booking has not been legitimately cancelled/no-showed, the liability becomes `OVERDUE`.
7. A driver with overdue platform-fee liabilities cannot receive or accept new ride/courier requests.
8. The driver dashboard shows all outstanding liabilities and total due.
9. The driver may settle outstanding fees from the dashboard using Paystack test payment.
10. Once all overdue liabilities are settled, the driver can receive requests again.
11. A valid cancellation/no-show flow can mark a liability `WAIVED` so drivers are not unfairly charged for abandoned bookings.

The MVP does not need a background worker. The backend may evaluate overdue status:
- when a driver opens the dashboard,
- when the driver attempts to go online,
- when the driver attempts to accept a new request,
- and when relevant booking/payment endpoints are called.

### 2.7 Tracking and safety
- The passenger must be able to see the Keke's live location after the driver accepts.
- Live tracking continues while the driver approaches the pickup point **and throughout the trip until the destination is reached and the ride is completed**.
- The driver device publishes location updates.
- The rider device subscribes to the active booking's location room.
- Location history does not need to be permanently stored for the MVP.
- The route line and current driver marker remain visible during an active ride so the passenger can monitor movement.

---

## 3. User Roles

### 3.1 Rider / Student
A rider can:
- register and log in;
- manage basic profile information;
- book 1–4 seats;
- see total fare before requesting;
- pay in-app;
- see driver details after acceptance;
- track the Keke live until destination;
- cancel when allowed;
- view ride history;
- rate a completed ride;
- create a courier request;
- track courier status;
- view courier history.

### 3.2 Driver
A driver can:
- register and log in;
- submit driver/Keke verification data;
- wait for admin approval;
- go online/offline after approval;
- receive ride and courier requests;
- accept one available request;
- mark ride stages;
- publish live location;
- complete rides/deliveries;
- see gross earnings, platform fees, available earnings, liabilities, and history;
- settle overdue platform fees;
- request a withdrawal from available wallet balance.

### 3.3 Admin
An admin can:
- view users and drivers;
- approve/reject driver verification;
- suspend/reactivate drivers;
- view rides and courier deliveries;
- view payment/fee records;
- view overdue driver liabilities;
- view withdrawal requests;
- approve/reject demo withdrawal requests;
- view basic dashboard metrics.

---

## 4. Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet / React-Leaflet
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Socket.IO

### External services
- MongoDB Atlas — database
- Cloudinary — profile, driver document, Keke and courier proof images
- OpenStreetMap tiles — map display
- OpenRouteService — route/distance support where required
- Paystack Test Mode — demo payments and fee settlement
- Render — backend deployment
- Vercel — frontend deployment
- GitHub — source control

---

## 5. Repository Structure

```text
ryda/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── AppRoutes.jsx
│   │   │   └── navigation/
│   │   ├── features/
│   │   │   ├── identity/          # Student 1
│   │   │   ├── rides/             # Student 2
│   │   │   ├── courier/           # Student 3
│   │   │   ├── driver-ops/        # Student 3
│   │   │   ├── payments/          # Student 4 / Captain
│   │   │   └── admin/             # Student 4 / Captain
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── constants/
│   │   └── main.jsx
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── app.js                  # Captain integration file
│   │   ├── server.js               # Captain integration file
│   │   ├── modules/
│   │   │   ├── identity/           # Student 1
│   │   │   ├── rides/              # Student 2
│   │   │   ├── courier/            # Student 3
│   │   │   ├── driverOps/          # Student 3
│   │   │   ├── payments/           # Student 4 / Captain
│   │   │   └── admin/              # Student 4 / Captain
│   │   └── shared/
│   │       ├── config/
│   │       ├── constants/
│   │       ├── middleware/
│   │       ├── utils/
│   │       └── sockets/
│   └── .env.example
│
├── docs/
│   ├── STUDENT_1_TASKS.md
│   ├── STUDENT_2_TASKS.md
│   ├── STUDENT_3_TASKS.md
│   ├── STUDENT_4_CAPTAIN_TASKS.md
│   ├── CODEX_WORKFLOW.md
│   └── TASK_REPORT_TEMPLATE.md
│
├── AGENTS.md
├── README.md
└── .gitignore
```

---

## 6. Shared Constants Contract

The captain creates this during the baseline scaffold before feature branches are created.

Suggested values:

```js
export const RIDA_CONFIG = {
  KEKE_SEAT_CAPACITY: 4,
  RIDE_FARE_PER_SEAT_NGN: 150,
  COURIER_FARE_NGN: 150,
  PLATFORM_FEE_RATE: 0.10,
  PAYMENT_GRACE_PERIOD_MINUTES: 60
};
```

Students may **import** these constants but must not change them from feature branches.

Derived values must be calculated, not hardcoded:

```text
rideGross = bookedSeats × RIDE_FARE_PER_SEAT_NGN
platformFee = rideGross × PLATFORM_FEE_RATE
driverNet = rideGross - platformFee
```

---

## 7. Status Contracts

### Driver verification
```text
PENDING
APPROVED
REJECTED
```

### Ride status
```text
REQUESTED
ACCEPTED
DRIVER_ARRIVING
DRIVER_ARRIVED
IN_PROGRESS
COMPLETED
CANCELLED
NO_SHOW
```

### Courier status
```text
REQUESTED
ACCEPTED
PICKED_UP
IN_TRANSIT
DELIVERED
CANCELLED
```

### Payment status
```text
PENDING
PAID
FAILED
REFUNDED
```

### Platform fee liability
```text
PENDING
SETTLED
OVERDUE
WAIVED
```

### Withdrawal request
```text
PENDING
APPROVED
REJECTED
PAID
```

No student or AI agent may add or rename statuses without teacher approval.

---

## 8. Core Data Models

Exact implementation may be feature-local, but the public field contracts below must be respected.

### User
```text
_id
fullName
email
phone
passwordHash
role: RIDER | DRIVER | ADMIN
profileImage
createdAt
updatedAt
```

### DriverProfile
```text
_id
userId
vehicleType: KEKE
vehicleNumber
vehicleImage
identityDocument
verificationStatus
isOnline
isSuspended
currentLatitude
currentLongitude
averageRating
completedRides
createdAt
updatedAt
```

### Ride
```text
_id
riderId
driverId
bookedSeats: 1..4
isPrivateRide
pickup.address
pickup.latitude
pickup.longitude
destination.address
destination.latitude
destination.longitude
grossFare
platformFee
driverNet
status
paymentStatus
acceptedAt
paymentDeadlineAt
startedAt
completedAt
createdAt
updatedAt
```

### CourierDelivery
```text
_id
senderId
driverId
recipientName
recipientPhone
packageDescription
pickup.address
pickup.latitude
pickup.longitude
dropoff.address
dropoff.latitude
dropoff.longitude
grossFare
platformFee
driverNet
status
paymentStatus
acceptedAt
paymentDeadlineAt
pickedUpAt
deliveredAt
createdAt
updatedAt
```

### Payment
```text
_id
userId
driverId
serviceType: RIDE | COURIER | FEE_SETTLEMENT
serviceId
reference
grossAmount
platformFee
driverNet
status
provider
paidAt
createdAt
```

### DriverWallet
```text
_id
driverId
availableBalance
pendingBalance
totalEarned
totalWithdrawn
updatedAt
```

### PlatformFeeLiability
```text
_id
driverId
serviceType
serviceId
amount
status
dueAt
settledAt
waivedAt
reason
```

### WithdrawalRequest
```text
_id
driverId
amount
status
adminNote
requestedAt
reviewedAt
reviewedBy
```

### Review
```text
_id
rideId
riderId
driverId
rating: 1..5
comment
createdAt
```

---

## 9. Core API Contracts

Feature owners may add internal endpoints, but these public routes should remain stable.

### Identity
```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PATCH /api/profile

POST /api/driver-verification
GET  /api/driver-verification/me
```

### Rides
```text
POST   /api/rides
GET    /api/rides/:id
GET    /api/rides/my
PATCH  /api/rides/:id/cancel
POST   /api/rides/:id/accept
PATCH  /api/rides/:id/status
POST   /api/rides/:id/review
```

### Driver operations
```text
PATCH /api/driver/availability
GET   /api/driver/dashboard
GET   /api/driver/requests
```

### Courier
```text
POST  /api/courier
GET   /api/courier/:id
GET   /api/courier/my
POST  /api/courier/:id/accept
PATCH /api/courier/:id/status
PATCH /api/courier/:id/cancel
```

### Payments
```text
POST /api/payments/initialize
GET  /api/payments/verify/:reference
GET  /api/payments/history

GET  /api/driver/wallet
GET  /api/driver/liabilities
POST /api/driver/liabilities/settle

POST /api/driver/withdrawals
GET  /api/driver/withdrawals
```

### Admin
```text
GET   /api/admin/dashboard
GET   /api/admin/users
GET   /api/admin/drivers
PATCH /api/admin/drivers/:id/verification
PATCH /api/admin/drivers/:id/suspension

GET   /api/admin/rides
GET   /api/admin/courier
GET   /api/admin/payments
GET   /api/admin/liabilities

GET   /api/admin/withdrawals
PATCH /api/admin/withdrawals/:id
```

---

## 10. Socket.IO Contract

Use one room per active service.

### Ride room
```text
ride:{rideId}
```

### Courier room
```text
courier:{courierId}
```

### Events
```text
driver:location:update
ride:location:update
ride:accepted
ride:status:update

courier:location:update
courier:accepted
courier:status:update
```

Location payload:
```json
{
  "serviceId": "mongodb-id",
  "latitude": 6.0000,
  "longitude": 3.0000,
  "timestamp": "ISO-8601"
}
```

The server must validate that the publishing driver owns the active booking before rebroadcasting location.

---

## 11. Main User Flows

### 11.1 Ride booking
```text
Rider logs in
→ selects pickup and destination
→ selects 1–4 seats
→ app calculates fixed price
→ rider submits request
→ eligible online drivers see request
→ one driver accepts
→ rider pays in-app
→ live driver tracking begins
→ driver arrives
→ driver starts trip
→ live tracking continues throughout trip
→ driver reaches destination
→ ride is completed
→ driver wallet is credited with net earning
→ rider can review driver
```

### 11.2 Private Keke
```text
bookedSeats = 4
isPrivateRide = true
grossFare = ₦600
platformFee = ₦60
driverNet = ₦540
```

### 11.3 Shared Keke booking
For 1–3 seats:
- Ryda is selling only the seats booked by that user.
- The driver may carry other non-Ryda passengers where campus rules allow.
- The Ryda booking and tracking still apply to the Ryda rider's trip.

### 11.4 Courier
```text
Sender creates delivery
→ enters recipient and package details
→ driver accepts
→ sender pays in-app
→ driver picks package up
→ live tracking may be shown while in transit
→ driver delivers package
→ marks delivered
→ driver wallet is credited
```

### 11.5 Driver withdrawal
```text
Driver opens Wallet
→ enters withdrawal amount
→ request becomes PENDING
→ admin reviews request
→ admin APPROVES or REJECTS
→ demo ledger updates
```

No real bank transfer is required.

---

## 12. Driver Eligibility Rules

A driver can receive new requests only when:

```text
verificationStatus === APPROVED
isOnline === true
isSuspended === false
overduePlatformFeeTotal === 0
```

The backend, not the frontend, is the authority for these checks.

---

## 13. Security Minimums

- Passwords must be hashed with bcrypt.
- JWT secret must come from environment variables.
- Never commit `.env`.
- Protect role-specific routes on the backend.
- Validate seat count as integer 1–4.
- Recalculate fares on the backend; never trust fare values sent by the browser.
- Verify Paystack transaction reference server-side.
- Never trust client-supplied driver IDs for ownership.
- Validate latitude and longitude ranges.
- Ensure only the assigned driver can change ride/courier operational status.
- Ensure only the booking owner can cancel/review where appropriate.
- Use Cloudinary URLs rather than storing image binaries in MongoDB.
- Admin endpoints require ADMIN role.

---

## 14. Environment Variables

Example only:

```env
# server
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PAYSTACK_SECRET_KEY=
OPENROUTESERVICE_API_KEY=

# client
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_OPENROUTESERVICE_API_KEY=
```

Secrets must never be placed in README screenshots, commits, or task reports.

---

## 15. What Is NOT in the MVP

Do not add these unless the teacher explicitly approves them after the base MVP is complete:

- Okada/motorcycle support
- Cars
- Multiple campuses
- surge pricing
- dynamic fare calculation
- in-app chat
- push notifications
- OTP login
- social login
- real KYC provider
- real bank payouts
- real production escrow
- referral system
- promo codes
- AI chatbot
- React Native app
- microservices
- Docker infrastructure
- Redis
- message queues

---

## 16. Student Ownership

### Student 1 — Identity & Driver Onboarding
Owns:
```text
client/src/features/identity/**
server/src/modules/identity/**
```

### Student 2 — Ride Booking, Maps & Ride Tracking
Owns:
```text
client/src/features/rides/**
server/src/modules/rides/**
```

### Student 3 — Courier & Driver Operations
Owns:
```text
client/src/features/courier/**
client/src/features/driver-ops/**
server/src/modules/courier/**
server/src/modules/driverOps/**
```

### Student 4 / Captain — Payments, Admin & Integration
Owns:
```text
client/src/features/payments/**
client/src/features/admin/**
server/src/modules/payments/**
server/src/modules/admin/**
client/src/app/**
server/src/app.js
server/src/server.js
server/src/shared/**
client/src/shared/**
deployment/integration files
```

No student may modify another owner's feature directory.

---

## 17. Git Strategy

Branches:

```text
main
└── integration
    ├── student-1/identity
    ├── student-2/rides
    ├── student-3/courier-driver
    └── student-4/payments-admin
```

### Rule
All feature branches must be created from the same captain-approved `integration` baseline commit.

### Merge order
Recommended integration order:
1. Student 1 identity
2. Student 4 payments core
3. Student 2 rides
4. Student 3 courier/driver operations
5. Student 4 admin
6. Captain cleanup/integration
7. `integration` → `main`

Merge order is for integration testing; students may still develop in parallel because their owned directories do not overlap.

---

## 18. Definition of MVP Complete

The MVP is complete when the team can demonstrate:

1. Rider and driver registration/login.
2. Admin-approved driver.
3. Driver online/offline state.
4. Rider books 1–4 seats.
5. Correct fixed fare and 10% platform fee.
6. Driver receives and accepts request.
7. Rider pays through Paystack test mode.
8. Driver is visible on map.
9. Location continues from acceptance through destination.
10. Ride progresses through approved statuses and completes.
11. Driver wallet receives net earning.
12. Rider can leave review.
13. Courier request can be created, accepted, paid and delivered.
14. Driver overdue-fee blocking can be demonstrated.
15. Driver can submit withdrawal request.
16. Admin can approve/reject withdrawal.
17. Admin dashboard shows core records.
18. Application is deployed and usable from public URLs.
