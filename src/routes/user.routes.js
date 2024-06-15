import { Router } from "express";
import db from "../../db.js"; // Asegúrate de incluir la extensión '.js'

const router = Router();

// -------------------SOLICITUDES HTTP

// Ejemplo de una ruta que consulta la base de datos
router.get("/users", async (req, res) => {
    try {
        const [rows, fields] = await db.query("SELECT * FROM user");
        res.json(rows);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error al obtener los usuarios");
    }
});

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    res.json(usuarios);
});

// Buscar un usuario por id
router.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    res.json(usuarios.find((usuario) => usuario.id === Number(id)));
});

// Buscar un usuario por numero de competidor
router.get("/usuarios/numeroCompetidor/:num", (req, res) => {
    const { num } = req.params;

    const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.numeroCompetidor === num
    );

    if (usuarioEncontrado) {
        res.json(usuarioEncontrado);
    } else {
        res.status(404).json({
            error: "El usuario por numero de competidor no fue encontrado",
        });
    }
});

// Crear un nuevo usuario
router.post("/usuarios", (req, res) => {
    const nuevoUsuario = req.body;
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// Actualizar usuarios por id
router.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const usuarioActualizado = req.body;

    // Buscar el índice del usuario que se quiere actualizar
    const indiceUsuario = usuarios.findIndex(
        (usuario) => usuario.id === parseInt(id)
    );

    if (indiceUsuario !== -1) {
        // Actualizar el usuario en la lista de usuarios
        usuarios[indiceUsuario] = {
            ...usuarios[indiceUsuario], // Mantener las propiedades originales del usuario
            ...usuarioActualizado, // Sobrescribir con las propiedades actualizadas
        };

        res.json(usuarios[indiceUsuario]); // Responder con el usuario actualizado
    } else {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
});

// Eliminar un usuario
router.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    // Filtrar la lista de usuarios para excluir al usuario con el ID especificado
    usuarios = usuarios.filter((usuario) => usuario.id !== parseInt(id));
    res.status(204); // Respondemos con un código de estado 204 (No Content)
});

//module.exports = router;
export default router;
