# Consultation Notes Modal Enhancement

## Overview
The ViewConsultationNotesModal component has been enhanced to provide different experiences for doctors and attendants, with PDF generation capabilities.

## Features

### For Doctors
- **Tab 1: Patient & Appointment Details** - Complete overview of patient information, medical history, appointment details, and doctor information
- **Tab 2: Consultation Notes** - Editable form for consultation notes, prescriptions, and recommendations

### For Attendants
- **Comprehensive View** - Single view with all information including patient details, doctor information, appointment data, and consultation notes (read-only)

### Common Features
- **PDF Generation** - Print button to generate and download/print consultation summary as PDF
- **Responsive Design** - Works on all device sizes
- **Accessibility** - Proper ARIA labels, keyboard navigation, and screen reader support

## Components Structure

```
app/components/appointments/
├── view-consultation-notes.tsx          # Main modal component
├── patient-info-tab.tsx                 # Patient & appointment details tab
├── consultation-notes-tab.tsx           # Consultation notes form tab
├── attendant-detail-view.tsx           # Full details view for attendants
└── index.ts                            # Component exports
```

## UI Components Added

```
app/components/ui/
└── tabs.tsx                            # Tab navigation component
```

## Utilities Added

```
app/lib/utils.ts
├── generatePDF()                       # Generic PDF generation
├── generateConsultationPDF()           # Consultation-specific PDF
└── printPage()                         # Browser print dialog
```

## Usage

The component maintains the same interface as before:

```tsx
<ViewConsultationNotesModal
  appointmentId={selectedAppointmentId}
  isOpen={isModalOpen}
  onOpenChange={setIsModalOpen}
/>
```

## Role-Based Rendering

The component automatically detects the user role and renders the appropriate view:

- `user.role === "doctor"` → Tabbed interface with editing capabilities
- `user.role === "attendant"` → Comprehensive read-only view with all details

## PDF Generation

The PDF includes:
- Clinic branding and generation timestamp
- Complete appointment information
- Patient demographics and medical history
- Doctor details and credentials
- Full consultation notes, prescriptions, and recommendations
- Professional formatting optimized for printing

## Data Structure

The component expects data from the `GetConsultationNotesResponse` type, which includes:
- `consultation` - Notes, prescriptions, recommendations
- `appointmentInfo` - Appointment details and status
- `doctorInfo` - Doctor profile and credentials
- `patientInfo` - Patient demographics and medical history

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Proper ARIA labels and roles
- High contrast support
- Responsive text scaling
