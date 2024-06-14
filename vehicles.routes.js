import { Router } from "express";

const router = Router();

//----------------------DATOS DE PRUEBA
let vehiculos = [
    {
        idVehiculo: 1,
        placa: "ABC123",
        numeroPolizaSoat: "12345",
        numeroCertificadoRTM: "67890",
        seguroTodoRiesgo: true,
        imagenVehiculo: "",
    },
    {
        idVehiculo: 2,
        placa: "XYZ789",
        numeroPolizaSoat: "54321",
        numeroCertificadoRTM: "09876",
        seguroTodoRiesgo: false,
        imagenVehiculo: "",
    },
    {
        idVehiculo: 3,
        placa: "DEF456",
        numeroPolizaSoat: "67890",
        numeroCertificadoRTM: "54321",
        seguroTodoRiesgo: true,
        imagenVehiculo: "",
    },
];

// Obtener todos los vehiculos
router.get("/vehiculos", (req, res) => {
    res.json(vehiculos);
});

// Buscar un usuario por id
router.get("/vehiculos/:idVehiculo", (req, res) => {
    const { idVehiculo } = req.params;

    // Buscar el vehículo en el array de vehiculos
    const vehiculoEncontrado = vehiculos.find(
        (vehiculo) => vehiculo.idVehiculo === Number(idVehiculo)
    );

    if (vehiculoEncontrado) {
        // Si se encuentra el vehículo, responder con el vehículo encontrado
        res.json(vehiculoEncontrado);
    } else {
        // Si no se encuentra el vehículo, responder con un código de estado 404 y un mensaje de error
        res.status(404).json({ error: "Vehículo por id no encontrado" });
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
