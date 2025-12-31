import Reserva from "../models/reserva.js";

// Listado completo de reservas (solo admin)
export const getReservas = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const reservas = await Reserva.find()
      .populate("usuario")
      .populate({ path: "viaje", populate: { path: "servicios" } });

    res.status(200).json({ ok: true, resultado: reservas });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error obteniendo reservas" });
  }
};

// Obtener reserva por ID (usuario propietario o admin)
export const getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate("usuario")
      .populate({ path: "viaje", populate: { path: "servicios" } });

    if (!reserva)
      return res
        .status(404)
        .json({ ok: false, error: "Reserva no encontrada" });

    if (
      req.session.user.id !== reserva.usuario._id.toString() &&
      !req.session.user.isAdmin
    ) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    res.status(200).json({ ok: true, resultado: reserva });
  } catch (err) {
    res
      .status(400)
      .json({ ok: false, error: "Error buscando la reserva indicada" });
  }
};

// Obtener reservas de un usuario autenticado
export const getMisReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.session.user.id })
      .populate({ path: "viaje", populate: { path: "servicios" } })
      .populate("usuario");

    res.status(200).json({ ok: true, resultado: reservas });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Error obteniendo reservas del usuario" });
  }
};

// Crear reserva (usuario autenticado)
export const createReserva = async (req, res) => {
  try {
    const fecCompra = req.body.fecCompra || Date.now();
    const estado = req.body.estado || "pendiente";
    const pasajeros = req.body.pasajeros || 1;

    const nuevaReserva = new Reserva({
      usuario: req.session.user.id,
      viaje: req.body.viaje,
      nombre: req.body.nombre,
      pasajeros,
      fecCompra,
      fecSalida: req.body.fecSalida,
      estado,
    });

    await nuevaReserva.save();
    res.status(201).json({ ok: true, resultado: nuevaReserva });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error añadiendo la reserva" });
  }
};

// Modificar reserva (solo propietario o admin)
export const updateReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva)
      return res
        .status(404)
        .json({ ok: false, error: "Reserva no encontrada" });

    if (
      req.session.user.id !== reserva.usuario.toString() &&
      !req.session.user.isAdmin
    ) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    const actualizado = await Reserva.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nombre: req.body.nombre,
          pasajeros: req.body.pasajeros || 1,
          fecSalida: req.body.fecSalida,
          estado: req.body.estado || "pendiente",
        },
      },
      { new: true }
    );

    res.status(200).json({ ok: true, resultado: actualizado });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error actualizando reserva" });
  }
};

// Borrar reserva (solo propietario o admin)
export const deleteReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva)
      return res
        .status(404)
        .json({ ok: false, error: "Reserva no encontrada" });

    if (
      req.session.user.id !== reserva.usuario.toString() &&
      !req.session.user.isAdmin
    ) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    await reserva.deleteOne();
    res.status(200).json({ ok: true, resultado: reserva });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error eliminando la reserva" });
  }
};
