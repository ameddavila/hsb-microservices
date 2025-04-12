// src/routes/user.routes.ts
import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "@middlewares/auth.middleware";
import { UserService } from "@services/user.service";

const router = Router();

// Endpoint protegido que lista usuarios
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
