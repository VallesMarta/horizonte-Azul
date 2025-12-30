import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Todas estas rutas requieren estar logueado
router.use(authMiddleware);

router.get("/", getWishlist); // Listar favoritos
router.post("/:viajeId", addToWishlist); // Añadir un viaje
router.delete("/:viajeId", removeFromWishlist); // Eliminar un viaje

export default router;
