import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { getRequest, postRequest, putRequest } from "~/lib/http";
import { displayErrorMessage, showSuccessToast } from "~/lib/utils";
import type {
  AddAppointmentPayload,
  AddAppointmentResponse,
  AppointmentResponse,
  AppointmentsListResponse,
  RescheduleAppointmentPayload,
  SaveConsultationPayload,
  SaveConsultationResponse,
} from "./types";

export interface GetAppointmentsOptions {
  date?: string;
  search?: string;
  status?: string;
  role: "doctor" | "attendant";
}

// Appointments hooks
export function useAddAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddAppointmentPayload) => {
      return postRequest<AddAppointmentResponse, AddAppointmentPayload>({
        url: API_ENDPOINTS.APPOINTMENTS.ADD,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Appointment added successfully:", data);
      showSuccessToast(
        "Appointment scheduled!",
        "Your appointment has been successfully scheduled"
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      console.error("Failed to add appointment:", error);
      displayErrorMessage(error);
    },
  });
}

export function useListAppointments(options: GetAppointmentsOptions) {
  const { date, search, status, role } = options;

  const queryParams = new URLSearchParams();
  if (date) queryParams.append("date", date);
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (role) queryParams.append("role", role);

  const url = `${API_ENDPOINTS.APPOINTMENTS.LIST}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return useQuery({
    queryKey: ["appointments", options],
    queryFn: async () => {
      return getRequest<AppointmentsListResponse>({
        url,
      });
    },
  });
}

export function useGetAppointmentById(appointmentId: string | number) {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      return getRequest<AppointmentResponse>({
        url: API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(appointmentId),
      });
    },
    enabled: !!appointmentId,
  });
}

export function usePayForAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string | number) => {
      return putRequest({
        url: API_ENDPOINTS.APPOINTMENTS.PAY(appointmentId),
        payload: {},
      });
    },
    onSuccess: (data, appointmentId) => {
      console.log("Appointment paid successfully:", data);
      showSuccessToast(
        "Payment successful!",
        "The appointment payment has been processed successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
    onError: (error) => {
      console.error("Failed to complete appointment:", error);
      displayErrorMessage(error);
    },
  });
}

export function useStartAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string | number) => {
      return putRequest({
        url: API_ENDPOINTS.APPOINTMENTS.START(appointmentId),
        payload: {},
      });
    },
    onSuccess: (data, appointmentId) => {
      console.log("Appointment started successfully:", data);
      showSuccessToast(
        "Appointment started!",
        "The appointment has been marked as started"
      );

      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
    onError: (error) => {
      console.error("Failed to start appointment:", error);
      displayErrorMessage(error);
    },
  });
}

export function useSaveConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveConsultationPayload) => {
      return postRequest<SaveConsultationResponse, SaveConsultationPayload>({
        url: API_ENDPOINTS.APPOINTMENTS.SAVE_CONSULTATION,
        payload,
      });
    },
    onSuccess: (data, variables) => {
      console.log("Consultation saved successfully:", data);
      showSuccessToast(
        "Consultation saved!",
        "Your consultation notes have been successfully saved"
      );
      // Invalidate both appointment and patient notes queries
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointment_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["patients", "notes", variables.appointment_id],
      });
    },
    onError: (error) => {
      console.error("Failed to save consultation:", error);
      displayErrorMessage(error);
    },
  });
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string | number) => {
      return putRequest({
        url: API_ENDPOINTS.APPOINTMENTS.COMPLETE(appointmentId),
        payload: {},
      });
    },
    onSuccess: (data, appointmentId) => {
      console.log("Appointment completed successfully:", data);
      showSuccessToast(
        "Appointment completed!",
        "The appointment has been marked as completed"
      );

      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
    onError: (error) => {
      console.error("Failed to complete appointment:", error);
      displayErrorMessage(error);
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      payload,
    }: {
      appointmentId: string | number;
      payload: RescheduleAppointmentPayload;
    }) => {
      return putRequest<AppointmentResponse, RescheduleAppointmentPayload>({
        url: API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(appointmentId),
        payload,
      });
    },
    onSuccess: (data, { appointmentId }) => {
      console.log("Appointment rescheduled successfully:", data);
      showSuccessToast(
        "Appointment rescheduled!",
        "Your appointment has been successfully rescheduled"
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
    onError: (error) => {
      console.error("Failed to reschedule appointment:", error);
      displayErrorMessage(error);
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string | number) => {
      return putRequest({
        url: API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId),
        payload: {},
      });
    },
    onSuccess: (data, appointmentId) => {
      console.log("Appointment cancelled successfully:", data);
      showSuccessToast(
        "Appointment cancelled",
        "Your appointment has been cancelled"
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
    },
    onError: (error) => {
      console.error("Failed to cancel appointment:", error);
      displayErrorMessage(error);
    },
  });
}
