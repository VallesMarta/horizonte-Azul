import express from "express";

import { UserRepository } from "../user-repository.js";

let router = express.Router();

// Servicio de listado
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({ username, password });
    res.send({ user });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

export default router;
