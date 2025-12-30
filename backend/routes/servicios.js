import express from "express";
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/serviciosController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Rutas públicas
router.get("/", getServicios);
router.get("/:id", getServicioById);

// Rutas protegidas (solo admin)
router.use(authMiddleware);

router.post("/", createServicio);
router.put("/:id", updateServicio);
router.delete("/:id", deleteServicio);

export default router;
