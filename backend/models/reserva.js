import mongoose from "mongoose";

let reservaSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, ref: "usuarios", 
        required: true,
        trim: true
    },
    viaje: { 
        type: mongoose.Schema.Types.ObjectId, ref: "viajes", 
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    fecCompra: { 
        type: Date, 
        default: Date.now 
    },
    fecSalida: { 
        type: Date,         
    },
    pasajeros: {
        type: Number,
        default: 1,
        min: 1
    },
    estado: { 
        type: String, 
        enum: ["pendiente", "confirmada", "cancelada"], 
        default: "pendiente" ,
        trim: true
    }
});
let Reserva = mongoose.model('reservas', reservaSchema);

export default Reserva;