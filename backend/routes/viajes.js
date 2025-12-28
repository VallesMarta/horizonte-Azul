import express from "express";
import Viaje from "../models/viaje.js";

let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Viaje.find().populate("servicios").then(resultado => {
        res.status(200)
            .send( {ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
            .send( {ok: false, error: "Error obteniendo viaje"});
    });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Viaje.findById(req.params.id).populate("servicios").then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se han encontrado viaje"});
    }).catch (error => {
        res.status(400)
        .send({ok: false, error: "Error buscando el viaje indicado"});
    });
});

// Servicio para insertar usuarios
router.post('/', (req, res) => {
    let nuevoViaje = new Viaje ({   
        origen: req.body.origen,
        origenAeropuerto: req.body.origenAeropuerto,
        destino: req.body.destino,
        destinoAeropuerto: req.body.destinoAeropuerto,
        precio: req.body.precio,
        img: req.body.img,
        servicios: req.body.servicios,
        descripcion: req.body.descripcion
    });

    nuevoViaje.save().then (resultado => {
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(err => {
        res.status(400)
        .send({ok:false, error:"Error añadiendo el viaje"});
    });
});

// Servicio para modificar usuarios
router.put('/:id', (req, res) => {
    Viaje.findByIdAndUpdate(req.params.id, {
        $set: {
            origen: req.body.origen,
            origenAeropuerto: req.body.origenAeropuerto,
            destino: req.body.destino,
            destinoAeropuerto: req.body.destinoAeropuerto,
            precio: req.body.precio,
            img: req.body.img,
            servicios: req.body.servicios,
            descripcion: req.body.descripcion
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el viaje"});

    }).catch(error => {
        res.status(400)
        .send({ok: false, error: "Error actualizando viaje"});
    });
});

// Servicio para borrar viaje
router.delete('/:id', (req, res) => {
    Viaje.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el viaje"});
    }).catch(error => {
        res.send({ok: false, error: "Error al eliminar el viaje"});
    });
});

export default router;