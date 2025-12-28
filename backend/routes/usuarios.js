import express from "express";
import Usuario from "../models/usuario.js";

let router = express.Router();

// Servicio de listado
router.get('/', (req, res) => {
    Usuario.find().then(resultado => {
        res.status(200)
            .send( {ok: true, resultado: resultado});
    }).catch (error => {
        res.status(500)
            .send( {ok: false, error: "Error obteniendo usuarios"});
    });
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
    Usuario.findById(req.params.id).then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se han encontrado usuarios"});
    }).catch (error => {
        res.status(400)
        .send({ok: false, error: "Error buscando el usuario indicado"});
    });
});

// Servicio para insertar usuarios
router.post('/', (req, res) => {
    let nuevoUsuario = new Usuario ({   
        username: req.body.username,
        password: req.body.password,
        nombre: req.body.nombre,
        email: req.body.email
    });

    nuevoUsuario.save().then (resultado => {
        res.status(200)
        .send({ok: true, resultado: resultado});
    }).catch(err => {
        res.status(400)
        .send({ok:false, error:"Error añadiendo el usuario"});
    });
});

// Servicio para modificar usuarios
router.put('/:id', (req, res) => {
    Usuario.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            nombre: req.body.nombre,
            email: req.body.email
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el usuario"});

    }).catch(error => {
        res.status(400)
        .send({ok: false, error: "Error actualizando usuario"});
    });
});

// Servicio para borrar usuarios
router.delete('/:id', (req, res) => {
    Usuario.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "No se ha encontrado el usuario"});
    }).catch(error => {
        res.send({ok: false, error: "Error al eliminar el usuario"});
    });
});

export default router;
