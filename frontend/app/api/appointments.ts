import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, putRequest, deleteRequest } from "~/lib/http";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import {
  showSuccessToast,
  showErrorToast,
  displayErrorMessage,
} from "~/lib/utils";

// Types for request payloads
export interface AddAppointmentPayload {
  patientId: string;
  doctorId: string;
  date: string; // ISO date string
}

export interface RescheduleAppointmentPayload {
  newDate: string; // ISO date string
}

// Appointments hooks
export function useAddAppointment() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddAppointmentPayload>({
    mutationFn: async (payload) => {
      return postRequest({
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

export function useListAppointments() {
  return useQuery<any, Error>({
    queryKey: ["appointments"],
    queryFn: async () => {
      return getRequest({
        url: API_ENDPOINTS.APPOINTMENTS.LIST,
      });
    },
  });
}

export function useStartAppointment() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string | number>({
    mutationFn: async (appointmentId) => {
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
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

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { appointmentId: string | number; payload: RescheduleAppointmentPayload }
  >({
    mutationFn: async ({ appointmentId, payload }) => {
      return putRequest({
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

  return useMutation<any, Error, string | number>({
    mutationFn: async (appointmentId) => {
      return deleteRequest({
        url: API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId),
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

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string | number>({
    mutationFn: async (appointmentId) => {
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
