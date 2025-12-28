// Librerías externas
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Enrutadores
import usuarios from "../frontend/src/routes/usuarios.js";
import viajes from "../frontend/src/routes/viajes.js";
import reservas from "../frontend/src/routes/reservas.js";
import servicios from "../frontend/src/routes/servicios.js";


// Creamos instancia de expres
let app = express();

// ruta a imagenes publicas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, '../public')));


// Conexión con la BD
mongoose.connect("mongodb://localhost:27017/horizonteAzul")
.then(() => console.log(' Conectado a MongoDB'))
  .catch(err => console.error(' Error al conectar MongoDB:', err));

// Permitir CORS desde cualquier origen (temporal)
// Permetre CORS només des del frontend
app.use(cors());

// Carga de middleware y enrutadores
app.use(express.json());
app.use('/usuarios', usuarios);
app.use('/viajes', viajes);
app.use('/reservas', reservas);
app.use('/servicios', servicios);


// Puesta en marcha del servidor
app.listen(3000, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:3000`);
});
