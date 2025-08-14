import axios from "axios";
import type { IUser } from "../types/user";

const API_URL = "http://localhost:5000/api/users"; // Adjust to your backend URL

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
