import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { postRequest, putRequest } from "~/lib/http";
import { displayErrorMessage, showSuccessToast } from "~/lib/utils";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
} from "./types";

// Types for request payloads

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
    mutationFn: async (payload: RegisterPayload) => {
      return postRequest<RegisterResponse, RegisterPayload>({
        url: API_ENDPOINTS.AUTH.REGISTER,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("User registration successful:", data);
      showSuccessToast("Registration successful!", "Welcome to the platform");

      queryClient.invalidateQueries({ queryKey: ["user"] });
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

  return useMutation<any, Error, PatientRegisterPayload>({
    mutationFn: async (payload) => {
      return postRequest({
        url: API_ENDPOINTS.AUTH.PATIENT_REGISTER,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Patient registration successful:", data);
      showSuccessToast(
        "Patient registration successful!",
        "Welcome to the healthcare platform"
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Patient registration failed:", error);
      displayErrorMessage(error);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return postRequest<LoginResponse, LoginPayload>({
        url: API_ENDPOINTS.AUTH.LOGIN,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      showSuccessToast("Login successful!", "Welcome back");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      displayErrorMessage(error);
    },
  });
}

export function useChangePassword() {
  return useMutation<any, Error, ChangePasswordPayload>({
    mutationFn: async (payload) => {
      return putRequest({
        url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Password changed successfully:", data);
      showSuccessToast(
        "Password changed successfully!",
        "Your password has been updated"
      );
    },
    onError: (error) => {
      console.error("Password change failed:", error);
      displayErrorMessage(error);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation<any, Error, RequestPasswordResetPayload>({
    mutationFn: async (payload) => {
      return postRequest({
        url: API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
        payload,
      });
    },
    onSuccess: (data) => {
      console.log("Password reset request successful:", data);
      showSuccessToast(
        "Password reset email sent!",
        "Check your email for reset instructions"
      );
    },
    onError: (error) => {
      console.error("Password reset request failed:", error);
      displayErrorMessage(error);
    },
  });
}
