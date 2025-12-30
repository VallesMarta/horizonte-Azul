import Usuario from "../models/usuario.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const { username, password, nombre, email } = req.body;

    // Validaciones
    if (!username || username.trim().length < 1) {
      return res
        .status(400)
        .json({ ok: false, error: "El username es obligatorio" });
    }
    if (!password || password.length < 4) {
      return res
        .status(400)
        .json({
          ok: false,
          error: "La contraseña debe tener al menos 4 caracteres",
        });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Email no válido" });
    }
    if (nombre && nombre.trim().length < 1) {
      return res
        .status(400)
        .json({
          ok: false,
          error: "El nombre no puede estar vacío si se proporciona",
        });
    }

    // Comprobar si ya existe un usuario con el mismo username
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ ok: false, error: "El username ya está en uso" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      nombre,
      email: email.trim().toLowerCase(),
    });

    await nuevoUsuario.save();

    res.status(201).json({ ok: true, resultado: nuevoUsuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error registrando usuario" });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // usar username
    const usuario = await Usuario.findOne({ username }); // buscar por username

    if (!usuario) {
      return res
        .status(401)
        .json({ ok: false, error: "Credenciales inválidas" });
    }

    // Comparar contraseña con bcrypt
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = generateToken({
      id: usuario._id,
      username: usuario.username,
      isAdmin: usuario.isAdmin,
    });

    // Guardar token en cookie HTTP only
    res.cookie("acces_token", token, { httpOnly: true });
    res.status(200).json({
      ok: true,
      message: "Login correcto",
      usuario: {
        id: usuario._id,
        username: usuario.username,
        isAdmin: usuario.isAdmin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error en el login" });
  }
};

export const logoutUser = (req, res) => {
  const token = req.cookies.acces_token;

  if (!token) {
    return res.status(400).json({ ok: false, message: "No hay sesión activa" });
  }

  res.clearCookie("acces_token");
  res.status(200).json({ ok: true, message: "Logout correcto" });
};
