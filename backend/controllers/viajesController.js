import Viaje from "../models/viaje.js";

// Listado de viajes (público)
export const getViajes = async (req, res) => {
  try {
    const viajes = await Viaje.find().populate("servicios");
    res.status(200).json({ ok: true, resultado: viajes });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error obteniendo viajes" });
  }
};

// Obtener viaje por ID (público)
export const getViajeById = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id).populate("servicios");
    if (!viaje)
      return res.status(404).json({ ok: false, error: "Viaje no encontrado" });
    res.status(200).json({ ok: true, resultado: viaje });
  } catch (err) {
    res
      .status(400)
      .json({ ok: false, error: "Error buscando el viaje indicado" });
  }
};

// Crear viaje (solo admin)
export const createViaje = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const nuevoViaje = new Viaje(req.body);
    await nuevoViaje.save();
    res.status(201).json({ ok: true, resultado: nuevoViaje });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error añadiendo el viaje" });
  }
};

// Modificar viaje (solo admin)
export const updateViaje = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const viaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!viaje)
      return res.status(404).json({ ok: false, error: "Viaje no encontrado" });
    res.status(200).json({ ok: true, resultado: viaje });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error actualizando el viaje" });
  }
};

// Borrar viaje (solo admin)
export const deleteViaje = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const eliminado = await Viaje.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ ok: false, error: "Viaje no encontrado" });
    res.status(200).json({ ok: true, resultado: eliminado });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error eliminando el viaje" });
  }
};
