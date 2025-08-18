import axios from "axios";
import type { IUser } from "../types/user";

const API_URL = "http://localhost:5000/api/users";
const API_AUTH = "http://localhost:5000/api/auth";

export const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post<IUser>(`${API_URL}/register`, userData);
  return res.data;
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const res = await axios.post<IUser>(`${API_URL}/login`, userData);
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const res = await axios.post(`${API_AUTH}/forgot-password`, { email });
  return res.data;
};

export const resetPasswordWithToken = async (
  token: string,
  password: string
) => {
  const res = await axios.post(`${API_AUTH}/reset-password`, {
    token,
    password,
  });
  return res.data;
};
