import express from "express";
import {
  getReservas,
  getReservaById,
  getMisReservas,
  createReserva,
  updateReserva,
  deleteReserva,
} from "../controllers/reservasController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get("/", getReservas); // listado completo (admin)
router.get("/mis-reservas", getMisReservas); // listado de reservas propias
router.get("/:id", getReservaById); // obtener reserva por id
router.post("/", createReserva); // crear reserva
router.put("/:id", updateReserva); // modificar
router.delete("/:id", deleteReserva); // eliminar

export default router;
