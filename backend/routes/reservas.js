import express from "express";
import Reserva from "../models/reserva.js";

let router = express.Router();

// Servicio de listado de reservas
router.get('/', (req, res) => {
    Reserva.find()
        .populate("usuario")
        .populate({
            path: "viaje",
            populate: { path: "servicios" } // Incluye servicios del viaje
        })
        .then(resultado => {
            res.status(200).send({ ok: true, resultado });
        })
        .catch(error => {
            res.status(500).send({ ok: false, error: "Error obteniendo reservas" });
        });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Reserva.findById(req.params.id).then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se han encontrado reserva"});
    }).catch (error => {
        res.status(400)
        .send({ok: false, error: "Error buscando la reserva indicado"});
    });
});

// Obtener reservas de un usuario
router.get("/mis-reservas/:usuarioId", async (req, res) => {
const { usuarioId } = req.params;

try {
    const reservas = await Reserva.find({ usuario: usuarioId })
    .populate({
        path: "viaje",
        populate: { path: "servicios" } // si quieres info de servicios incluidos
    })
    .populate("usuario");

    res.status(200).json({ ok: true, resultado: reservas });
} catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Error obteniendo reservas del usuario" });
}
});

// Servicio para insertar usuarios
router.post('/', (req, res) => {
    // Si no hay fecha, se pone la actual
    const fecCompra = req.body.fecCompra || Date.now();    
    // Si no hay estado, se pone 'pendiente'
    const estado = req.body.estado ? req.body.estado : 'pendiente';
    // Pasajeros → si no viene, por defecto 1
    const pasajeros = req.body.pasajeros ? req.body.pasajeros : 1;

    let nuevaReserva = new Reserva({
        usuario: req.body.usuario,
        viaje: req.body.viaje,
        nombre: req.body.nombre,
        pasajeros: pasajeros,
        fecCompra: fecCompra,
        fecSalida: req.body.fecSalida,
        estado: estado

    });

    nuevaReserva.save().then (resultado => {
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(err => {
        res.status(400)
        .send({ok:false, error:"Error añadiendo la reserva"});
    });
});

// Servicio para modificar reserva
router.put('/:id', (req, res) => {
    // Si no hay estado, se pone 'pendiente'
    const estado = req.body.estado ? req.body.estado : 'pendiente';
    // Pasajeros → si no viene, por defecto 1
    const pasajeros = req.body.pasajeros ? req.body.pasajeros : 1;
    Reserva.findByIdAndUpdate(req.params.id, {
        $set: {                       
            nombre: req.body.nombre,
            pasajeros: pasajeros,
            fecSalida: req.body.fecSalida,
            estado: estado
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado la reserva"});

    }).catch(error => {
        res.status(400)
        .send({ok: false, error: "Error actualizando reserva"});
    });
});

// Servicio para borrar usuarios
router.delete('/:id', (req, res) => {
    Reserva.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado la reserva"});
    }).catch(error => {
        res.send({ok: false, error: "Error al eliminar la reserva"});
    });
});

export default router;
