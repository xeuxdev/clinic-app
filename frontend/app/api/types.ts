export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface User {
  id: number;
  account_id: number;
  full_name: string;
  phone_number: string;
  date_of_birth: string | null;
  blood_group: string | null;
  medical_condition: string | null;
  current_medication: string | null;
  known_allergies: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export type RegisterResponse = {
  success: boolean;
  message: string;
  user: User;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}
