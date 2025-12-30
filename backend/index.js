import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Configs
import connectDB from "./config/db.js";
import corsMiddleware from "./middlewares/cors.js";

// Rutas
import usuarios from "./routes/usuarios.js";
import viajes from "./routes/viajes.js";
import reservas from "./routes/reservas.js";
import servicios from "./routes/servicios.js";
import login from "./routes/login.js";
import register from "./routes/register.js";
import logout from "./routes/logout.js";
import wishlist from "./routes/wishlist.js";

dotenv.config();
const app = express();

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "../public")));

// Conexión DB
connectDB();

// Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());


// Rutas 
app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/viajes", viajes);
app.use("/usuarios", usuarios);
app.use("/reservas", reservas);
app.use("/servicios", servicios);
app.use("/wishlist", wishlist);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
