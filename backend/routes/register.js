import express from "express";
import { UserRepository } from "../user-repository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password, nombre, email } = req.body;

  try {
    const resultado = await UserRepository.create({
      username,
      password,
      nombre,
      email,
    });

    res.status(201).json({ ok: true, resultado });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

export default router;
