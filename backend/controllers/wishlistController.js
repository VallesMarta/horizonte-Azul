import Usuario from "../models/usuario.js";
import Viaje from "../models/viaje.js";

// Listar wishlist del usuario logueado
export const getWishlist = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.user.id).populate(
      "wishlist"
    );
    res.status(200).json({ ok: true, resultado: usuario.wishlist });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Error obteniendo lista de deseos" });
  }
};

// Añadir un viaje a la wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { viajeId } = req.params;
    const usuario = await Usuario.findById(req.session.user.id);

    if (!usuario) {
      return res
        .status(404)
        .json({ ok: false, error: "Usuario no encontrado" });
    }

    // Comprobar si ya está en la wishlist
    const yaExiste = usuario.wishlist.some((v) => v.toString() === viajeId);

    if (yaExiste) {
      return res.status(400).json({
        ok: false,
        error: "El viaje ya está en la lista de deseos",
      });
    }

    if (!usuario.wishlist.includes(viajeId)) {
      usuario.wishlist.push(viajeId);
      await usuario.save();
    }

    res
      .status(200)
      .json({ ok: true, message: "Viaje añadido a la lista de deseos" });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Error añadiendo a la lista de deseos" });
  }
};

// Eliminar un viaje de la wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { viajeId } = req.params;
    const usuario = await Usuario.findById(req.session.user.id);
    if (!usuario) {
      return res
        .status(404)
        .json({ ok: false, error: "Usuario no encontrado" });
    }

    // Comprobar si el viaje está en la wishlist
    const existe = usuario.wishlist.some((v) => v.toString() === viajeId);

    if (!existe) {
      return res.status(400).json({
        ok: false,
        error: "El viaje no está en la lista de deseos",
      });
    }

    usuario.wishlist = usuario.wishlist.filter((v) => v.toString() !== viajeId);
    await usuario.save();

    res
      .status(200)
      .json({ ok: true, message: "Viaje eliminado de la lista de deseos" });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Error eliminando de la lista de deseos" });
  }
};
