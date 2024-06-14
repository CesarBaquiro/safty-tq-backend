import express from "express";
import usersRoutes from "./src/routes/user.routes.js";
import vehiclesRoutes from "./src/routes/vehicles.routes.js";

const app = express();

const PORT = 8000;

//Condiguracion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", usersRoutes);
app.use("/api", vehiclesRoutes);

// Ruta básica
app.get("/", (req, res) => {
    res.send("¡Hola, Trepadores Quindio!");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on Port http://localhost:${PORT}`);
});
