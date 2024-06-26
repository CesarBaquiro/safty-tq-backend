import { Router } from "express";
import db from "../../db.js"; // Asegúrate de incluir la extensión '.js'
const router = Router();

//----------------------DATOS DE PRUEBA

// Obtener todos los vehiculos
router.get("/vehiculos", (req, res) => {
    res.json("Vehiculosssss");
});

// Buscar un vehiculo por id de usuario
router.get("/vehiculos/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const [rows, fields] = await db.query(
            "SELECT * FROM vehicle WHERE user_id = ?",
            [user_id]
        );

        if (rows.length > 0) {
            res.json(rows[0]); // Devolver el primer resultado encontrado
        } else {
            res.status(404).json({ error: "Vehiculo no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar vehiculo por user_id:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Buscar un vehiculo por placa
router.get("/vehiculos/placa/:placa", (req, res) => {
    //const placaBuscada = req.params.placa.toUpperCase(); // Convertir la placa a mayúsculas
    const { placa } = req.params;

    // Buscar el vehículo en el array de vehiculos
    const vehiculoEncontrado = vehiculos.find(
        (vehiculo) => vehiculo.placa === placa
    );

    if (vehiculoEncontrado) {
        // Si se encuentra el vehículo, responder con el vehículo encontrado
        res.json(vehiculoEncontrado);
    } else {
        // Si no se encuentra el vehículo, responder con un código de estado 404 y un mensaje de error
        res.status(404).json({ error: "Vehículo por placa no encontrado" });
    }
});

export default router;
