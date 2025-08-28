import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description: description,
    duration: 3000,
  });
}

export function showErrorToast(message: string, description?: string) {
  toast.error(message, {
    description: description,
    duration: 3000,
  });
}

export function showInfoToast(message: string, description?: string) {
  toast.message(message, {
    description: description,
    duration: 3000,
  });
}

/**
 * Extracts and formats error messages from API error responses
 * @param error The error response from the API
 * @returns A formatted error message string
 */
export function displayErrorMessage(error: any) {
  if (typeof error === "string") {
    showErrorToast(error);
  }

  // If it's an axios error with a response
  if (error?.response?.data) {
    error = error.response.data;
  }

  // Handle structured validation errors
  if (error?.error?.errors && Array.isArray(error.error.errors)) {
    const errorMessages = error.error.errors
      .map((err: any) => {
        if (err.message) {
          showErrorToast(err.message);
        }
        if (err.path && err.msg) {
          showErrorToast(`${err.path}: ${err.msg}`);
        }
        return null;
      })
      .filter(Boolean);

    if (errorMessages.length > 0) {
      showErrorToast(errorMessages.join(", "));
    }
  }

  if (error?.message) {
    showErrorToast(error.message);
  }

  if (error?.data?.message) {
    showErrorToast(error.data.message);
  }
}

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAge(dob: string | null) {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Generate a printable PDF document from HTML content
 * @param content HTML content to convert to PDF
 * @param filename Optional filename for the PDF
 */
export function generatePDF(content: string, filename?: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showErrorToast(
      "Unable to open print window. Please check pop-up blocker settings."
    );
    return;
  }

  const currentDate = new Date().toLocaleDateString();
  const defaultFilename = filename || `consultation-notes-${currentDate}`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${defaultFilename}</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .clinic-logo {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 5px;
        }
        .clinic-info {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 12px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          padding: 10px;
          background: #f9fafb;
          border-left: 3px solid #3b82f6;
        }
        .info-label {
          font-weight: bold;
          font-size: 14px;
          color: #374151;
          margin-bottom: 5px;
        }
        .info-value {
          color: #6b7280;
          font-size: 14px;
        }
        .notes-section {
          padding: 15px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
          .header { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load then trigger print
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    // Close window after printing (optional)
    setTimeout(() => printWindow.close(), 1000);
  }, 500);
}

/**
 * Trigger browser print dialog for the current page
 */
export function printPage() {
  window.print();
}

/**
 * Generate PDF content specifically for consultation notes
 * @param consultationData Full consultation data from API
 */
export function generateConsultationPDF(consultationData: any) {
  const { appointmentInfo, doctorInfo, patientInfo, consultation } =
    consultationData;
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const content = `
    <div class="header">
      <div class="clinic-logo">HealthCare Clinic</div>
      <div class="clinic-info">
        Professional Medical Services<br>
        Generated on ${currentDate} at ${currentTime}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Appointment Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Appointment ID</div>
          <div class="info-value">#${appointmentInfo.id}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date & Time</div>
          <div class="info-value">${formatDate(
            appointmentInfo.appointment_date
          )} at ${formatTime(appointmentInfo.appointment_date)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value">${appointmentInfo.status.toUpperCase()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Payment Status</div>
          <div class="info-value">${appointmentInfo.paymentstatus.toUpperCase()}</div>
        </div>
      </div>
      ${
        appointmentInfo.note
          ? `
        <div class="info-item">
          <div class="info-label">Appointment Note</div>
          <div class="info-value">${appointmentInfo.note}</div>
        </div>
      `
          : ""
      }
    </div>

    <div class="section">
      <h2 class="section-title">Patient Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Full Name</div>
          <div class="info-value">${patientInfo.full_name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age</div>
          <div class="info-value">${calculateAge(
            patientInfo.date_of_birth
          )} years</div>
        </div>
        <div class="info-item">
          <div class="info-label">Blood Group</div>
          <div class="info-value">${
            patientInfo.blood_group || "Not specified"
          }</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">${patientInfo.phone_number}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${patientInfo.email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date of Birth</div>
          <div class="info-value">${
            patientInfo.date_of_birth
              ? formatDate(patientInfo.date_of_birth)
              : "Not specified"
          }</div>
        </div>
      </div>
      
      ${
        patientInfo.medical_condition ||
        patientInfo.current_medication ||
        patientInfo.known_allergies
          ? `
        <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; color: #1f2937;">Medical History</h3>
        <div class="info-grid">
          ${
            patientInfo.medical_condition
              ? `
            <div class="info-item" style="background: #fef2f2; border-left-color: #ef4444;">
              <div class="info-label">Medical Condition</div>
              <div class="info-value">${patientInfo.medical_condition}</div>
            </div>
          `
              : ""
          }
          ${
            patientInfo.current_medication
              ? `
            <div class="info-item" style="background: #eff6ff; border-left-color: #3b82f6;">
              <div class="info-label">Current Medication</div>
              <div class="info-value">${patientInfo.current_medication}</div>
            </div>
          `
              : ""
          }
          ${
            patientInfo.known_allergies
              ? `
            <div class="info-item" style="background: #fff7ed; border-left-color: #f97316;">
              <div class="info-label">Known Allergies</div>
              <div class="info-value">${patientInfo.known_allergies}</div>
            </div>
          `
              : ""
          }
        </div>
      `
          : ""
      }
    </div>

    <div class="section">
      <h2 class="section-title">Doctor Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Doctor Name</div>
          <div class="info-value">${doctorInfo.profile.full_name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">${doctorInfo.profile.phone_number}</div>
        </div>
        ${
          doctorInfo.details.length > 0
            ? `
          <div class="info-item">
            <div class="info-label">Specialization</div>
            <div class="info-value">${doctorInfo.details[0].specialization}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Experience</div>
            <div class="info-value">${doctorInfo.details[0].years_of_experience} years</div>
          </div>
          <div class="info-item">
            <div class="info-label">License Number</div>
            <div class="info-value">${doctorInfo.details[0].license_number}</div>
          </div>
        `
            : ""
        }
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Consultation Details</h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1f2937;">Consultation Notes</h3>
        <div class="notes-section">
          ${consultation?.notes || "No consultation notes available"}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1f2937;">Prescriptions</h3>
        <div class="notes-section">
          ${consultation?.prescriptions || "No prescriptions provided"}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1f2937;">Recommendations</h3>
        <div class="notes-section">
          ${consultation?.recommendations || "No recommendations provided"}
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This document was generated electronically by HealthCare Clinic Management System</p>
      <p>For questions about this consultation, please contact the clinic directly.</p>
    </div>
  `;

  generatePDF(content, `consultation-${patientInfo.full_name}-${currentDate}`);
}
