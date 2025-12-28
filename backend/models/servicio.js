import mongoose from "mongoose";

let servicioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        unique: true
    } 
});

let Servicio = mongoose.model('servicios', servicioSchema)

export default Servicio;