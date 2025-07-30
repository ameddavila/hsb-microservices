// src/routes/menu.routes.ts

import { Router } from "express";
import * as MenuController from "@controllers/menu.controller";
import { authenticateToken } from "@middlewares/authenticateToken";
import { checkPermission } from "@middlewares/checkPermission";

const router = Router();

// 📌 Todas las rutas están protegidas con JWT + permisos
router.get("/ping", (req, res) => {
  console.log("📡 Ping recibido en /menus/ping");
  res.json({ status: "OK", timestamp: new Date() });
});

router.get(
  "/",
  authenticateToken,
  checkPermission("read:menus"),
  MenuController.getAllMenus
);

router.get(
  "/tree",
  authenticateToken,
  checkPermission("read:menus"),
  MenuController.getMenuTree
);


router.get(
  "/:id",
  authenticateToken,
  checkPermission("read:menus"),
  MenuController.getMenuById
);

router.post(
  "/",
  authenticateToken,
  checkPermission("manage:menus"), // 🔁 Mejor usar "manage:menus" si así está en tu token
  MenuController.createMenu
);

router.put(
  "/:id",
  authenticateToken,
  checkPermission("manage:menus"), // 🔁 Igual que arriba
  MenuController.updateMenu
);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission("manage:menus"),
  MenuController.deleteMenu
);

export default router;
