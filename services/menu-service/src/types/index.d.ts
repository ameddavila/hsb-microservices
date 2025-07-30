// src/types/index.d.ts
import "express";

declare module "express" {
  export interface Request {
    user?: {
      id: string;
      username: string;
      email: string;
      dni: string;
      role: string;
    };
  }
}
