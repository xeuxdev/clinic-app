# API payloads & expected responses

*All endpoints and expected response*

---

## Auth routes

### `POST /register-patient`

**Middlewares:** `verifySession`, `verifyRole` (protected)
**Validation (body):**

* `email` — required, valid email
* `password` — required, min 6 chars
* `phone_number` — required, valid mobile phone
* `full_name` — required
* `date_of_birth` — required, format `YYYY-MM-DD`
* `blood_group` — required, one of `A+ A- B+ B- AB+ AB- O+ O-`
* `medical_condition`, `current_medication`, `known_allergies` — optional (max 255 chars)

**Example request**

```http
POST /register-patient
Content-Type: application/json
Authorization: Bearer <SESSION_TOKEN>

{
  "email": "jane.doe@example.com",
  "password": "StrongPass123",
  "phone_number": "+2348012345678",
  "full_name": "Jane Doe",
  "date_of_birth": "1990-05-15",
  "blood_group": "O+",
  "medical_condition": "Hypertension",
  "current_medication": "Amlodipine",
  "known_allergies": "Penicillin"
}
```

**Success (201)**

```json
{
  "success": true,
  "message": "Account created",
  "user": {
    "id": "<profile_id>",
    "account_id": "<account_id>",
    "full_name": "Jane Doe",
    "phone_number": "+2348012345678",
    "date_of_birth": "1990-05-15",
    "blood_group": "O+",
    "medical_condition": "Hypertension",
    "current_medication": "Amlodipine",
    "known_allergies": "Penicillin"
  }
}
```

**Errors**

* `400` validation error (first validation message returned)

  ```json
  { "success": false, "message": "Email is required" }
  ```
* `400` user exists

  ```json
  { "success": false, "message": "User with this email already exists" }
  ```
* `500` internal server error

---

### `POST /register-user` (create receptionist)

**Middlewares:** none in route (open)
**Validation (body):**

* `email`, `password` (min 6), `phone_number`, `full_name`

**Example request**

```json
{
  "email": "reception@example.com",
  "password": "Rec3ptionPass!",
  "phone_number": "+2348012345678",
  "full_name": "Rex Reception"
}
```

**Success (201)**

```json
{
  "success": true,
  "message": "Receptionist account created successfully",
  "user": {
    "id": "<profile_id>",
    "account_id": "<account_id>",
    "full_name": "Rex Reception",
    "phone_number": "+2348012345678"
  }
}
```

**Errors**

* `400` validation error
* `500` internal server error

---

### `POST /login`

**Validation (body):**

* `email` required, valid email
* `password` required, min 6

**Example request**

```json
{
  "email": "jane.doe@example.com",
  "password": "StrongPass123"
}
```

**Success (200)**

```json
{
  "success": true,
  "message": "User logged in",
  "user": {
    "id": "<profile_profile_id>",
    "account_id": "<account_id>",
    "full_name": "Jane Doe",
    "phone_number": "+2348012345678",
    "date_of_birth": "1990-05-15"
    // ... whatever columns exist in "user".profile
  }
}
```

**Errors**

* `400` validation error
* `404` if account not found OR incorrect credentials (code uses 404 when email not found)

  ```json
  { "success": false, "message": "Invalid email or password" }
  ```
* `400` if password mismatch (code uses 400 for bad password)
* `500` internal server error

---

### `POST /request_password_reset`

**Validation (body):**

* `email` — must be a valid email

**Example request**

```json
{ "email": "jane.doe@example.com" }
```

**Success (200)**

```json
{ "success": true, "message": "Password reset link sent to your email" }
```

**Errors**

* `400` validation error
* `404` if user not found:

  ```json
  { "success": false, "message": "No user with this email" }
  ```
* `500` internal server error

---

### `POST /change_password`

**Controller expects:** a `reset_password_token` **URL param** and a `new_password` in body.
**Validation:**

* `reset_password_token` param required
* `new_password` body min 8 chars
**Example request**

```http
POST /change_password/2f9a1bcd-...
Content-Type: application/json

{ "new_password": "NewStr0ngPass!" }
```

**Success (200)**

```json
{ "success": true, "message": "Password reset successful" }
```

**Errors**

* `400` validation error
* `404` invalid/expired token:

  ```json
  { "success": false, "message": "Invalid or expired token" }
  ```
* `500` internal server error

---

## Appointment routes

> All appointment routes are under `appointmentRoute` and most are protected by `verifySession` + `verifyRole`.

---

### `POST /appointment/add-appointment`

**Middlewares:** `verifySession`, `verifyRole`
**Validation (body):**

* `email` — required, isEmail
* `profile_id` — required, integer >= 1
* `appointment_date` — required, ISO8601 date (converted to Date)
* `doctor_id` — required, integer >= 1
* `notes` — optional

**Behavior:** first checks `auth.accounts` for `email`. If no account → 400 `"Patient account not found"`. Otherwise inserts into `appointment.bookings`.

**Example request**

```json
{
  "email": "jane.doe@example.com",
  "profile_id": 123,
  "appointment_date": "2025-09-01T10:00:00Z",
  "doctor_id": 45,
  "notes": "Follow-up appointment"
}
```

**Success (201)**

```json
{
  "success": true,
  "message": "Appointment added successfully",
  "appointment": {
    "appointment_id": 456,
    "profile_id": 123,
    "appointment_date": "2025-09-01T10:00:00.000Z",
    "doctor_id": 45,
    "notes": "Follow-up appointment",
    "status": "scheduled" // example — actual schema determines fields
  }
}
```

**Errors**

* `400` validation error
* `400` patient not found:

  ```json
  { "success": false, "message": "Patient account not found" }
  ```
* `500` internal server error

---

### `GET /appointment/get-appointments`

**Middlewares:** `verifySession`, `verifyRole`
**Behavior:** returns all rows from `appointment.bookings` ordered by `appointment_date ASC`.

**Success (200) — if bookings exist**

```json
{
  "success": true,
  "message": "All bookings",
  "bookings": [
    {
      "appointment_id": 456,
      "profile_id": 123,
      "appointment_date": "2025-09-01T10:00:00.000Z",
      "doctor_id": 45,
      "notes": "Follow-up appointment",
      "status": "scheduled"
    },
    { /* ... */ }
  ]
}
```

**Success (200) — none found**

```json
{
  "success": true,
  "message": "No bookings found",
  "bookings": []
}
```

**Errors**

* `500` internal server error

---

### `POST /appointment/cancel/:appointment_id`

**Middlewares:** `verifySession`, `verifyRole`
**Validation:** `appointment_id` param must be integer >= 1

**Behavior:** checks existence, then updates `status = 'cancelled'` and returns updated row.

**Success (200)**

```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "appointment": {
    "appointment_id": 456,
    "status": "cancelled",
    /* other appointment fields */
  }
}
```

**Errors**

* `400` validation error
* `404` appointment not found
* `500` internal server error

---

### `POST /appointment/in_progress/:appointment_id`

**Middlewares:** `verifySession`, `verifyRole`
**Validation:** `appointment_id` param must be integer

**Behavior:** updates `status = 'in_progress'`, returns updated row. If `rowCount === 0` → `404`.

**Success (200)**

```json
{
  "success": true,
  "message": "Appointment marked as in progress",
  "data": {
    "appointment_id": 456,
    "status": "in_progress",
    /* ... */
  }
}
```

**Errors**

* `400` validation error
* `404` appointment not found
* `500` internal server error

---

### `POST /appointment/reschedule/:appointment_id`

**Middlewares:** `verifySession`, `verifyRole`
**Validation:**

* `appointment_id` param integer
* `new_date` in body required, `.isDate()` (controller uses `.isDate()` — ensure acceptable format)

**Example request**

```json
{ "new_date": "2025-09-02T12:00:00Z" }
```

**Success (200)**

```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "data": {
    "appointment_id": 456,
    "appointment_date": "2025-09-02T12:00:00.000Z",
    "status": "rescheduled"
  }
}
```

**Errors**

* `400` validation error
* `404` appointment not found
* `500` internal server error

---

### `POST /appointment/complete/:appointment_id`

**Middlewares:** `verifySession`, `verifyRole`
**Validation:** `appointment_id` param integer

**Behavior:** sets `status = 'completed'`.

**Success (200)**

```json
{
  "success": true,
  "message": "Appointment completed successfully",
  "data": {
    "appointment_id": 456,
    "status": "completed",
    /* ... */
  }
}
```

**Errors**

* `400` validation error
* `404` appointment not found (if update returns zero rows)
* `500` internal server error

---

## Doctor / Receptionist routes

### `POST /doctor_receptionist/register`

**Middlewares:** `verifySession`, `verifyRole`
**Validation (body):**

* `email`, `password` (min 6), `phone_number`, `full_name`, `role` (required)

**Example request**

```json
{
  "full_name": "Dr. John Smith",
  "email": "dr.john@example.com",
  "phone_number": "+2348090000000",
  "password": "DrPass123!",
  "role": "doctor"
}
```

**Success (201)**

```json
{
  "id": "<account_id>",
  "full_name": "Dr. John Smith",
  "email": "dr.john@example.com",
  "phone_number": "+2348090000000",
  "role": "doctor"
  // returned directly the inserted account row
}
```

**Errors**

* `400` email already exists
* `400` validation error
* `500` internal server error

---

### `GET /doctor_receptionist/get_doctor_receptionist/:role`  **(BUG / mismatch — see Notes)**

**Controller expects:** `role` as URL param (`param("role")`)
**Current route in your code:** `'/doctor_receptionist/get_doctor_receptionist/role'` (this is a literal `role` segment — it does not provide a param)

**Corrected route (suggested):**

```
GET /doctor_receptionist/get_doctor_receptionist/:role
```

**Behavior:**

* Queries `auth.accounts WHERE role = $1` → returns `accounts`
* Collects `accountIds` and queries `"user".profile WHERE account_id = ANY($1::uuid[])` and returns `profiles` (see note about casting below)

**Example request**

```
GET /doctor_receptionist/get_doctor_receptionist/doctor
Authorization: Bearer <SESSION_TOKEN>
```

**Success (200)**

```json
{
  "success": true,
  "accounts": [
    { "id": "<account_id_1>", "full_name": "Dr A", "email": "a@x.com", "role": "doctor", ... }
  ],
  "profiles": [
    { "id": "<profile_id_1>", "account_id": "<account_id_1>", "full_name": "Dr A", ... }
  ]
}
```

**Errors**

* `400` validation error
* `404` no accounts found:

  ```json
  { "message": "No doctor found" } // message uses template `No ${role} found`
  ```
* `500` internal server error

---

## Notes, issues & suggested fixes (from reading the code)

1. **`changePassword` route mismatch**

   * Controller expects `reset_password_token` as a URL param (`param('reset_password_token')`) but your route is:

     ```js
     authRoute.post('/change_password', changePassword)
     ```

     This needs to be changed to something like:

     ```js
     authRoute.post('/change_password/:reset_password_token', changePassword)
     ```

2. **`get_doctor_receptionist` route path uses literal `role`**

   * Current route:

     ```js
     doctor_receptionistRoute.get('/doctor_receptionist/get_doctor_receptionist/role', verifySession, verifyRole, get_doctor_receptionist)
     ```

     Replace `role` with parameter syntax:

     ```js
     doctor_receptionistRoute.get('/doctor_receptionist/get_doctor_receptionist/:role', verifySession, verifyRole, get_doctor_receptionist)
     ```

3. **`setSession` usage**

   * Both `userLogin` and `patientRegister` call `setSession(...)` with just the profile id: `setSession(loggedInUser.rows[0].id)` and `setSession(newProfile.rows[0].id)`. Confirm `setSession` signature — usually session requires request/response context or returns a token. If `setSession` needs `req` or `res`, pass them; otherwise this may not create a usable session.

4. **`profile` fetch in `get_doctor_receptionist` uses `ANY($1::uuid[])`**

   * If your `account_id` column is an integer, casting to `uuid[]` will fail. Ensure the DB type matches (UUID vs integer) or change cast to the appropriate type (e.g. `int[]` / `integer[]`) or use `= ANY($1::uuid[])` with correctly typed array.

5. **Consistency of returned shapes**

   * Some endpoints return `appointment` (cancel) while others return `data` (start/complete/reschedule). Consider normalizing keys (`appointment` vs `data`) for consistent client handling.

6. **Validation specifics**

   * `rescheduleAppointment` uses `.isDate()` — this accepts a wide range of date formats. If you want strict ISO strings, use `.isISO8601()` to match `addAppointment` behavior.

---

If you want, I can:

* produce a ready-to-copy **Postman collection** (JSON) for all endpoints; or
* generate **OpenAPI (swagger)** doc for these endpoints (I’ll infer schemas and show the corrected routes).

Which would you prefer next?
