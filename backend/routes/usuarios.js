import express from "express";

import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuariosController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Rutas protegidas
router.use(authMiddleware);

router.get("/", getUsuarios); // Listado completo (solo admin)
router.get("/:id", getUsuarioById); // Usuario por ID
router.put("/:id", updateUsuario); // Modificar usuario
router.delete("/:id", deleteUsuario); // Borrar usuario (solo admin)

export default router;
