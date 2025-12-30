import express from "express";
import {
  getViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje,
} from "../controllers/viajesController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Rutas públicas
router.get("/", getViajes);
router.get("/:id", getViajeById);

// Rutas protegidas
router.use(authMiddleware);

router.post("/", createViaje);
router.put("/:id", updateViaje);
router.delete("/:id", deleteViaje);

export default router;
