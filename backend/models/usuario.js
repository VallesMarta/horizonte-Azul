import mongoose from "mongoose";

let usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,   
    minlength: 1,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  nombre: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // por defecto todos los usuarios no son admin
  }, 
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: "viajes" // Lista de deseos
  }], 
});

let Usuario = mongoose.model("usuarios", usuarioSchema);

export default Usuario;

