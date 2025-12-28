import mongoose  from "mongoose";

let viajeSchema = new mongoose.Schema({
    origen: {
        type: String,
        required: true,
        trim: true
    },
    origenAeropuerto: {
        type: String,
        required: true,
        trim: true
    },
    destino: {
        type: String,
        required: true,
        trim: true
    },
    destinoAeropuerto: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },  
    img:{
        type: String
    }, 
    servicios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'servicios'
    }],
    descripcion: {
        type: String,
    }
});
let Viaje = mongoose.model('viajes', viajeSchema);

export default Viaje;