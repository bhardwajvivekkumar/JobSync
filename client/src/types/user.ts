export interface IUser {
  _id?: string;
  name: string;
  email: string;
  token?: string; // JWT token from backend
}
