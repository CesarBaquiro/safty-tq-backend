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

// Buscar un usuario por número de competidor
router.get("/usuarios/numeroCompetidor/:num", async (req, res) => {
    const { num } = req.params;

    try {
        // Consulta para obtener el usuario por número de competidor
        const [userRows, userFields] = await db.query(
            "SELECT * FROM user WHERE competitorNum = ?",
            [num]
        );

        if (userRows.length > 0) {
            const user = userRows[0];
            const userId = user.user_id;

            // Consulta para obtener las alergias del usuario
            const [allergyRows, allergyFields] = await db.query(
                "SELECT * FROM safty_tq_db.allergy WHERE user_id = ?",
                [userId]
            );

            // Consulta para obtener los contactos del usuario
            const [contactRows, contactFields] = await db.query(
                "SELECT * FROM safty_tq_db.contact WHERE user_id = ?",
                [userId]
            );

            // Añadir las alergias y contactos al objeto del usuario
            user.allergies = allergyRows;
            user.contacts = contactRows;

            // Devolver el usuario con las alergias y contactos
            res.json(user);
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
router.post("/staffcontrol/usuarios", async (req, res) => {
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

// Crear un nuevo usuario
router.post("/staffcontrol/vehiculos", async (req, res) => {
    const nuevoVehiculo = req.body;

    try {
        const result = await db.query("INSERT INTO vehicle SET ?", [
            nuevoVehiculo,
        ]);
        nuevoVehiculo.id = result[0].insertId; // Obtener el ID del usuario insertado

        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        console.error("Error al crear nuevo vehiculo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Crear un nuevo usuario completo-------------------------------------------

router.post("/staffcontrol/usuarioCompleto", async (req, res) => {
    const {
        competitorNum,
        name,
        lastname,
        rh,
        eps,
        competitorImage,
        vehicle,
        contacts,
        allergies,
    } = req.body;

    // Validación de contactos
    if (!contacts || contacts.length < 1 || contacts.length > 2) {
        return res
            .status(400)
            .json({ error: "Se debe proporcionar entre 1 y 2 contactos." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Comprobar si competitorNum ya existe
        const [existingCompetitor] = await connection.query(
            "SELECT * FROM user WHERE competitorNum = ?",
            [competitorNum]
        );
        if (existingCompetitor.length > 0) {
            return res
                .status(400)
                .json({ error: "El número de competidor ya existe." });
        }

        // Comprobar si plate ya existe (si se proporcionó plate y no está vacía)
        if (vehicle && vehicle.plate && vehicle.plate.trim() !== "") {
            if (vehicle.plate.length > 6) {
                return res.status(400).json({
                    error: "La placa del vehículo no puede tener más de 6 caracteres.",
                });
            }
            const [existingPlate] = await connection.query(
                "SELECT * FROM vehicle WHERE plate = ?",
                [vehicle.plate]
            );
            if (existingPlate.length > 0) {
                return res
                    .status(400)
                    .json({ error: "La placa del vehículo ya existe." });
            }
        }

        // Insertar el usuario
        const [userResult] = await connection.query(
            `INSERT INTO user (competitorNum, name, lastname, rh, eps, competitorImage, vehicle_id) 
             VALUES (?, ?, ?, ?, ?, ?, NULL)`,
            [competitorNum, name, lastname, rh, eps, competitorImage]
        );
        const userId = userResult.insertId;

        // Insertar el vehículo asociado al usuario (si hay datos de vehículo)
        let vehicleId = null;
        if (
            vehicle &&
            (vehicle.vehicleReference ||
                vehicle.plate ||
                vehicle.numberPolicySoat ||
                vehicle.certificateNumberRTM ||
                vehicle.allRisk ||
                vehicle.vehicleImage)
        ) {
            const [vehicleResult] = await connection.query(
                `INSERT INTO vehicle (vehicleReference, plate, numberPolicySoat, certificateNumberRTM, allRisk, vehicleImage, user_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    vehicle.vehicleReference,
                    vehicle.plate,
                    vehicle.numberPolicySoat,
                    vehicle.certificateNumberRTM,
                    vehicle.allRisk,
                    vehicle.vehicleImage,
                    userId,
                ]
            );
            vehicleId = vehicleResult.insertId;

            // Actualizar el vehicle_id en la tabla user
            await connection.query(
                `UPDATE user SET vehicle_id = ? WHERE user_id = ?`,
                [vehicleId, userId]
            );
        }

        // Insertar contactos para el usuario
        for (const contact of contacts) {
            await connection.query(
                `INSERT INTO contact (user_id, contact_reference, contact_info) VALUES (?, ?, ?)`,
                [userId, contact.reference, contact.info]
            );
        }

        // Insertar alergias para el usuario (si hay alergias)
        if (allergies && allergies.length > 0) {
            for (const allergy of allergies) {
                await connection.query(
                    `INSERT INTO allergy (user_id, allergy_info) VALUES (?, ?)`,
                    [userId, allergy.info]
                );
            }
        }

        await connection.commit();
        res.status(201).json({
            message: "Usuario creado exitosamente",
            userId,
            vehicleId,
        });
    } catch (error) {
        await connection.rollback();
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        connection.release();
    }
});

// Actualizar usuarios por id
router.put("/staffcontrol/usuarios/:id", async (req, res) => {
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
router.delete("/staffcontrol/usuarios/:id", async (req, res) => {
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
