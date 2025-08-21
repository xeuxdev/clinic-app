# Clinic Management System - Project Plan

## 🏥 **Project Overview**

A simplified clinic management system for college project focusing on real clinic workflow between attendants and doctors.

---

## 👥 **User Types**

- **Attendant/Receptionist** - Front desk operations
- **Doctor** - Patient consultations and medical decisions

---

## 🔄 **Clinic Workflow & Features**

### **ATTENDANT WORKFLOW:**

- Login with password n email(username).
- new receptionists are created from backend(no UI for this).

#### **1. Patient Registration & Search**

- Search existing patients (avoid duplicates)
- Register new patients with basic info

#### **2. Payment Processing**

- Record payment (demo/mock system)
- Generate simple receipt
- Track payment status

#### **3. Appointment Management**

- Book appointments for patients
- View daily appointment schedule
- Cancel/reschedule appointments

---

### **DOCTOR WORKFLOW:**

#### **1. View Appointments**

- See daily schedule with patient details
- View patient basic information
- Access appointment history

#### **2. Patient Consultation**

- Mark session as "In Progress"
- Add consultation notes
- Mark session as "Completed"

#### **3. Medical Decisions**

- Prescribe medications
- Recommend further consultation
- Add treatment notes

---

## 📋 **Feature Breakdown**

### **Core Features:**

#### **Attendant Dashboard:**

✅ **Already have foundation in current UI**

- Patient search bar
- Patient registration form
- Appointment booking interface
- Payment collection (demo)

#### **Doctor Dashboard:**

✅ **Already have appointment view**

- Today's appointments list
- Patient consultation interface
- Prescription form
- Session status management

---

## 🗄️ **Database Schema (Simplified)**

### **Required Tables:**

```sql
1. patients
   - id, name, phone, age, address, medical_history

2. doctors
   - id, name, specialization

3. appointments
   - id, patient_id, doctor_id, date, time, status, payment_status

4. consultations
   - id, appointment_id, notes, prescriptions, recommendations

5. payments
   - id, patient_id, amount, date, method
```

---

## 🎯 **Implementation Plan**

### **Phase 1: Attendant Features**

1. **Patient Management**
   - Search patients by name/phone
   - Add new patient form
   - View patient details

2. **Appointment Booking**
   - Select doctor and time slot
   - Book appointment for patient
   - Collect payment (demo)

### **Phase 2: Doctor Features**

1. **Appointment View**
   - Today's schedule
   - Patient basic info display

2. **Consultation Interface**
   - Start/end consultation
   - Add notes and prescriptions
   - Mark as completed

### **Phase 3: Integration**

- Connect all forms to backend
- Add simple navigation between attendant/doctor views
- Basic data validation

---

## 🚀 **Modified UI Structure**

### **Current Routes to Adapt:**

- `/` → **Attendant Dashboard** (patient search, daily overview)
- `/appointment` → **Appointment Management** (booking for patients)
- `/doctor` → **Doctor Dashboard** (today's appointments)
- `/consultation/:id` → **Patient Consultation View**

### **Features to Remove/Simplify:**

- Complex authentication (just simple role selection "doctor" | "attendant")
- Complex calendar (just today's view for doctors)

---

## 🛠️ **Technical Stack**

### **Frontend (Current):**

- React Router v7
- TypeScript
- Tailwind CSS
- Radix UI Components

### **Backend (Proposed):**

- Node.js + Express
- PostgresQL database (simple setup)
- Basic REST API
- Simple session management

---

## 📝 **API Endpoints (Essential)**

### **Patient Management:**

``` js
GET /patients?search=:query
POST /patients
PUT /patients/:id
GET /patients/:id
```

### **Appointment Management:**

``` js
GET /appointments?date=:date
POST /appointments
PUT /appointments/:id
DELETE /appointments/:id
```

### **Doctor Operations:**

``` js
GET /doctors
GET /doctors/:id/appointments
POST /consultations
PUT /consultations/:id
```

### **Payment (Demo):**

``` js
POST /payments/:patient_id - update status of payment
```

---

## ✅ **Success Criteria**

### **Minimum Viable Product:**

- [ ] Attendant can search and register patients
- [ ] Attendant can book appointments
- [ ] Attendant can process payments (demo)
- [ ] Doctor can view daily appointments
- [ ] Doctor can conduct consultations
- [ ] Doctor can prescribe medications
- [ ] Basic data persistence

### **Nice-to-Have Features:**

- [ ] Appointment history
- [ ] Patient medical history
- [ ] Print receipts/prescriptions
- [ ] Simple reporting

---

## 🎓 **Learning Objectives Demonstrated**

1. **Full-Stack Development**
   - Frontend UI with React
   - Backend API with Node.js
   - Database design and operations

2. **Software Engineering Practices**
   - Project planning and requirements
   - User workflow analysis
   - API design
   - Database normalization

3. **Real-World Application**
   - Business process automation
   - User role management
   - Data validation and integrity

---

## 🔧 **Implementation Notes**

### **Simplifications for College Project:**

- Use SQLite instead of PostgreSQL/MySQL
- Mock payment system (no real payment gateway)
- Basic session management (no complex JWT)
- Simple UI without advanced animations
- Focus on functionality over aesthetics

### **Key Features to Highlight:**

- CRUD operations
- Search functionality
- Form validation
- State management
- API integration
- Responsive design
