import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useUser } from "~/context/user-context";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { postRequest } from "~/lib/http";
import { displayErrorMessage, showSuccessToast } from "~/lib/utils";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPatientPayload,
  RegisterResponse,
  RegisterUserPayload,
} from "./types";

export interface PatientRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

// Auth hooks
export function useSignUp() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: RegisterUserPayload) => {
      return postRequest<RegisterResponse, RegisterUserPayload>({
        url: API_ENDPOINTS.AUTH.REGISTER_USER,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("User registration successful:", data);
      showSuccessToast("Registration successful!", "Welcome to the platform");

      navigate("/auth/login");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      displayErrorMessage(error);
    },
  });
}

export function usePatientRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPatientPayload) => {
      return postRequest<RegisterResponse, RegisterPatientPayload>({
        url: API_ENDPOINTS.AUTH.REGISTER_PATIENT,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Patient registration successful:", data);
      showSuccessToast("Patient registration successful!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      console.error("Patient registration failed:", error);
      displayErrorMessage(error);
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return postRequest<LoginResponse, LoginPayload>({
        url: API_ENDPOINTS.AUTH.LOGIN,
        payload,
      });
    },
    onSuccess: ({ user }) => {
      showSuccessToast("Login successful!", "Welcome back");

      setUser({
        userId: user.id,
        accountId: user.account_id,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        role: user.role,
      });

      if (user.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      displayErrorMessage(error);
    },
  });
}
