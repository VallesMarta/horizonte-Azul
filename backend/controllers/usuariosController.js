import Usuario from "../models/usuario.js";

// Listado de todos los usuarios (solo admin)
export const getUsuarios = async (req, res) => {
  try {
    if (!req.session.user?.isAdmin) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    const usuarios = await Usuario.find();
    res.status(200).json({ ok: true, resultado: usuarios });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error obteniendo usuarios" });
  }
};


// Obtener usuario por ID (puede ser el mismo usuario o admin)
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res
        .status(404)
        .json({ ok: false, error: "Usuario no encontrado" });

    // Protección: solo el mismo usuario o admin
    if (
      req.session.user?.id !== usuario._id.toString() &&
      !req.session.user?.isAdmin
    ) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    res.status(200).json({ ok: true, resultado: usuario });
  } catch (err) {
    res
      .status(400)
      .json({ ok: false, error: "Error buscando el usuario indicado" });
  }
};

// Actualizar usuario (solo el mismo usuario o admin)
export const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res
        .status(404)
        .json({ ok: false, error: "No se ha encontrado el usuario" });

    // Protección
    if (
      req.session.user?.id !== usuario._id.toString() &&
      !req.session.user?.isAdmin
    ) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ ok: true, resultado: actualizado });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error actualizando usuario" });
  }
};

// Borrar usuario (solo admin)
export const deleteUsuario = async (req, res) => {
  try {
    // Solo admin
    if (!req.session.user?.isAdmin) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res
        .status(404)
        .json({ ok: false, error: "No se ha encontrado el usuario" });

    res.status(200).json({ ok: true, resultado: eliminado });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error al eliminar el usuario" });
  }
};
