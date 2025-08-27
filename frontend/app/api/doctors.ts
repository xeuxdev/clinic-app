import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { getRequest } from "~/lib/http";
import type { GetDoctorsResponse } from "./types";

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
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      return getRequest<GetDoctorsResponse>({
        url: API_ENDPOINTS.DOCTORS.GET_DOCTORS,
      });
    },
  });
}

export function useGetDoctorById(doctorId: string) {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      return getRequest({
        url: API_ENDPOINTS.DOCTORS.GET_BY_ID(doctorId),
      });
    },
    enabled: !!doctorId,
  });
}
