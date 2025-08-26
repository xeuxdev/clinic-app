import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, putRequest, deleteRequest } from "~/lib/http";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import {
  showSuccessToast,
  showErrorToast,
  displayErrorMessage,
} from "~/lib/utils";

// Types for request payloads
export interface AddDoctorPayload {
  name: string;
  specialization: string;
  email: string;
}

export interface UpdateDoctorPayload {
  name?: string;
  specialization?: string;
  email?: string;
}

// Doctors hooks
export function useListDoctors() {
  return useQuery<any, Error>({
    queryKey: ["doctors"],
    queryFn: async () => {
      return getRequest({
        url: API_ENDPOINTS.DOCTORS.LIST,
      });
    },
  });
}

export function useGetDoctorById(doctorId: string | number) {
  return useQuery<any, Error>({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      return getRequest({
        url: API_ENDPOINTS.DOCTORS.GET_BY_ID(doctorId),
      });
    },
    enabled: !!doctorId,
  });
}

export function useAddDoctor() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddDoctorPayload>({
    mutationFn: async (payload) => {
      return postRequest({
        url: API_ENDPOINTS.DOCTORS.ADD,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Doctor added successfully:", data);
      showSuccessToast(
        "Doctor added!",
        "New doctor has been successfully added to the system"
      );
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error) => {
      console.error("Failed to add doctor:", error);
      displayErrorMessage(error);
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    { doctorId: string | number; payload: UpdateDoctorPayload }
  >({
    mutationFn: async ({ doctorId, payload }) => {
      return putRequest({
        url: API_ENDPOINTS.DOCTORS.UPDATE(doctorId),
        payload,
      });
    },
    onSuccess: (data, { doctorId }) => {
      console.log("Doctor updated successfully:", data);
      showSuccessToast(
        "Doctor updated!",
        "Doctor information has been successfully updated"
      );
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
    },
    onError: (error) => {
      console.error("Failed to update doctor:", error);
      displayErrorMessage(error);
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string | number>({
    mutationFn: async (doctorId) => {
      return deleteRequest({
        url: API_ENDPOINTS.DOCTORS.DELETE(doctorId),
      });
    },
    onSuccess: (data, doctorId) => {
      console.log("Doctor deleted successfully:", data);
      showSuccessToast(
        "Doctor removed",
        "Doctor has been successfully removed from the system"
      );
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
    },
    onError: (error) => {
      console.error("Failed to delete doctor:", error);
      displayErrorMessage(error);
    },
  });
}
