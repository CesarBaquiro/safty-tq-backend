import { Router } from "express";
import db from "../../db.js"; // Asegúrate de incluir la extensión '.js'

const router = Router();

// -------------------SOLICITUDES HTTP

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const [rows, fields] = await db.query("SELECT * FROM user");
        res.json(rows);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error al obtener los usuarios");
    }
});

// Buscar un usuario por id
router.get("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows, fields] = await db.query(
            "SELECT * FROM user WHERE user_id = ?",
            [id]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // Devolver el primer resultado encontrado
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar usuario por id:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Buscar un usuario por numero de competidor
router.get("/usuarios/numeroCompetidor/:num", async (req, res) => {
    const { num } = req.params;

    try {
        const [rows, fields] = await db.query(
            "SELECT * FROM user WHERE competitorNum = ?",
            [num]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // Devolver el primer resultado encontrado
        } else {
            res.status(404).json({
                error: "Usuario por número de competidor no encontrado",
            });
        }
    } catch (error) {
        console.error(
            "Error al buscar usuario por número de competidor:",
            error
        );
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Crear un nuevo usuario
router.post("/usuarios", async (req, res) => {
    const nuevoUsuario = req.body;

    try {
        const result = await db.query("INSERT INTO user SET ?", [nuevoUsuario]);
        nuevoUsuario.id = result[0].insertId; // Obtener el ID del usuario insertado

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al crear nuevo usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Actualizar usuarios por id
router.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const usuarioActualizado = req.body;

    try {
        const result = await db.query("UPDATE user SET ? WHERE user_id = ?", [
            usuarioActualizado,
            id,
        ]);

        if (result[0].affectedRows > 0) {
            res.json({ ...usuarioActualizado, id: parseInt(id) });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar usuario por id:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Eliminar un usuario
router.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("DELETE FROM user WHERE user_id = ?", [
            id,
        ]);

        if (result[0].affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar usuario por id:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//module.exports = router;
export default router;
