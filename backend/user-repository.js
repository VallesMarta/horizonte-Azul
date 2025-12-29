import Usuario from "./models/usuario.js";
import bcrypt from "bcrypt";

export class UserRepository {
  static async create({ username, password, nombre, email }) {
    Validation.username(username);
    Validation.password(password);

    const user = await Usuario.findOne({ username });
    if (user) {
      throw new Error("username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuarioCreado = await Usuario.create({
      username,
      password: hashedPassword,
      nombre,
      email,
    });

    return {
      username: usuarioCreado.username,
      nombre: usuarioCreado.nombre,
      email: usuarioCreado.email,
    };
  }

  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = await Usuario.findOne({ username });
    if (!user) throw new Error("username does not exist");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("password is invalid");

    return {
      username: user.username,
      nombre: user.nombre,
      email: user.email,
    };
  }
}

class Validation {
  static username(username) {
    if (!username || typeof username !== "string") {
      throw new Error("Username inválido");
    }
  }
  static password(password) {
    if (!password || typeof password !== "string") {
      throw new Error("Password inválida");
    }
  }
}
