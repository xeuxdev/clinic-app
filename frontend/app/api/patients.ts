import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { getRequest } from "~/lib/http";
import type {
  GetConsultationNotesResponse,
  GetPatientsResponse,
  Patient,
  SearchPatientResponse,
} from "./types";

export function useListPatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await getRequest<GetPatientsResponse>({
        url: API_ENDPOINTS.PATIENTS.GET_ALL,
      });
      return res?.patients ?? [];
    },
  });
}

export function useSearchPatients(query?: string) {
  return useQuery<Patient[]>({
    queryKey: ["patients", "search", query ?? ""],
    queryFn: async () => {
      // Guard to avoid calling the API for empty queries
      if (!query || query.trim() === "") {
        return [];
      }
      const res = await getRequest<SearchPatientResponse>({
        url: API_ENDPOINTS.PATIENTS.SEARCH(query.trim()),
      });
      return res?.results ?? [];
    },
    enabled: Boolean(query && query.trim() !== ""),
  });
}

export function useViewPatientsNotes(
  patientId: string | number,
  isOpen: boolean
) {
  return useQuery({
    queryKey: ["patients", "notes", patientId],
    queryFn: async () => {
      const res = await getRequest<GetConsultationNotesResponse>({
        url: API_ENDPOINTS.PATIENTS.CONSULTATION_NOTES(patientId),
      });
      return res;
    },
    enabled: !!patientId && isOpen,
  });
}
