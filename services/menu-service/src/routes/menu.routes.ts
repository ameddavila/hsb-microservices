import { Router } from "express";
import * as MenuController from "@controllers/menu.controller";
import { authenticateToken } from "@middlewares/authenticateToken";
import { checkPermission } from "@middlewares/";

const router = Router();

// 📌 Todas las rutas están protegidas con JWT + permisos

router.get(
  "/",
  authenticateToken,
  checkPermission("read:menus"),
  MenuController.getAllMenus
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
  checkPermission("write:menus"),
  MenuController.createMenu
);

router.put(
  "/:id",
  authenticateToken,
  checkPermission("write:menus"),
  MenuController.updateMenu
);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission("delete:menus"),
  MenuController.deleteMenu
);

export default router;
