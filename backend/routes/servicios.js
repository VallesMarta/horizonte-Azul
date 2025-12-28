import express from "express";
import Servicio from "../models/servicio.js";

let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Servicio.find().then(resultado => {
        res.status(200)
            .send( {ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
            .send( {ok: false, error: "Error obteniendo servicios"});
    });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Servicio.findById(req.params.id).then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se han encontrado servicio"});
    }).catch (error => {
        res.status(400)
        .send({ok: false, error: "Error buscando el servicio indicado"});
    });
});

// Servicio para insertar usuarios
router.post('/', (req, res) => {
    let nuevoServicio = new Servicio ({  
        nombre: req.body.nombre
    });

    nuevoServicio.save().then (resultado => {
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(err => {
        res.status(400)
        .send({ok:false, error:"Error añadiendo el servicio"});
    });
});

// Servicio para modificar usuarios
router.put('/:id', (req, res) => {
    Servicio.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre            
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el servicio"});

    }).catch(error => {
        res.status(400)
        .send({ok: false, error: "Error actualizando servicio"});
    });
});

// Servicio para borrar usuarios
router.delete('/:id', (req, res) => {
    Servicio.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el servicio"});
    }).catch(error => {
        res.send({ok: false, error: "Error al eliminar el servicio"});
    });
});

export default router;