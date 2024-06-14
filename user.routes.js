import { Router } from "express";

const router = Router();

//----------------------DATOS DE PRUEBA
let usuarios = [
    {
        id: 1,
        numeroCompetidor: "001",
        nombre: "Juan",
        apellido: "Perez",
        rh: "O+",
        alergias: ["Polen", "Mariscos"],
        contactos: ["123456789", "correo@example.com"],
        vehiculo: "Toyota",
        placa: "ABC123",
        imagenCompetidor: "",
    },
    {
        id: 2,
        numeroCompetidor: "002",
        nombre: "María",
        apellido: "Gómez",
        rh: "A-",
        alergias: [],
        contactos: ["987654321", "otrocorreo@example.com"],
        vehiculo: "Honda",
        placa: "XYZ789",
        imagenCompetidor: "",
    },
    {
        id: 3,
        numeroCompetidor: "003",
        nombre: "Carlos",
        apellido: "Martínez",
        rh: "B+",
        alergias: ["Maní"],
        contactos: ["555555555", "contacto@correo.com"],
        vehiculo: "Chevrolet",
        placa: "DEF456",
        imagenCompetidor: "",
    },
];

// -------------------SOLICITUDES HTTP

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
