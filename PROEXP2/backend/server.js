import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import pedidosRouter from "./routes/pedidos.js";
import productosRouter from "./routes/productos.js";
import facturasRouter from "./routes/facturas.js";
import reservasRouter from "./routes/reservas.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/ping", (req, res) => res.send("pong"));

// Rutas API
app.use("/api/pedidos", pedidosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/facturas", facturasRouter);
app.use("/api/reservas", reservasRouter);


// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
