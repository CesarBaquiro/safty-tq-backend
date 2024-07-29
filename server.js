import express from "express";
import usersRoutes from "./src/routes/user.routes.js";
import vehiclesRoutes from "./src/routes/vehicles.routes.js";
import cors from "cors";
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from "./config.js";

const app = express();

const PORT = process.env.PORT || 8000;

//Condiguracion de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Permite todas las solicitudes desde cualquier origen
//app.use(cors());

// O permite solicitudes solo desde http://localhost:4200
app.use(cors({ origin: "http://localhost:4200" }));

app.use("/api", usersRoutes);
app.use("/api", vehiclesRoutes);

// Ruta básica
app.get("/", (req, res) => {
    res.send("¡Hola, Trepadores!");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(
        "host:",
        DB_HOST,
        "port:",
        DB_PORT,
        "user:",
        DB_USER,
        "password:",
        DB_PASSWORD,
        "database:",
        DB_NAME
    );
    //    console.log(`Server running on Port http://localhost:${PORT}`);
});
