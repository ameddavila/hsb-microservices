// src/types/express.ts (o donde lo tengas)
import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  dni: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profileImage: string | null;
  roles: string[];
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  csrfToken?: () => string;
}
