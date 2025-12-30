import Servicio from "../models/servicio.js";

// Listado de servicios (público)
export const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.status(200).json({ ok: true, resultado: servicios });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error obteniendo servicios" });
  }
};

// Obtener servicio por ID (público)
export const getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio)
      return res
        .status(404)
        .json({ ok: false, error: "Servicio no encontrado" });
    res.status(200).json({ ok: true, resultado: servicio });
  } catch (err) {
    res
      .status(400)
      .json({ ok: false, error: "Error buscando el servicio indicado" });
  }
};

// Crear servicio (solo admin)
export const createServicio = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const nuevoServicio = new Servicio({ nombre: req.body.nombre });
    await nuevoServicio.save();
    res.status(201).json({ ok: true, resultado: nuevoServicio });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error añadiendo el servicio" });
  }
};

// Modificar servicio (solo admin)
export const updateServicio = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const actualizado = await Servicio.findByIdAndUpdate(
      req.params.id,
      { $set: { nombre: req.body.nombre } },
      { new: true }
    );

    if (!actualizado)
      return res
        .status(404)
        .json({ ok: false, error: "Servicio no encontrado" });
    res.status(200).json({ ok: true, resultado: actualizado });
  } catch (err) {
    res
      .status(400)
      .json({ ok: false, error: "Error actualizando el servicio" });
  }
};

// Borrar servicio (solo admin)
export const deleteServicio = async (req, res) => {
  if (!req.session.user?.isAdmin)
    return res.status(403).json({ ok: false, error: "No autorizado" });

  try {
    const eliminado = await Servicio.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res
        .status(404)
        .json({ ok: false, error: "Servicio no encontrado" });
    res.status(200).json({ ok: true, resultado: eliminado });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error eliminando el servicio" });
  }
};
