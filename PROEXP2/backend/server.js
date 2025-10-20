import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import pedidosRouter from "./routes/pedidos.js";
import productosRouter from "./routes/productos.js";
import facturasRouter from "./routes/facturas.js";
import reservasRouter from "./routes/reservas.js";
import empleadosRouter from "./routes/empleados.js";
import clientesRouter from "./routes/clientes.js";
import sedeRouter from "./routes/sedes.js";

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
app.use("/api/empleados", empleadosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/sedes", sedeRouter);

// Listar endpoints disponibles
console.log("📚 Endpoints disponibles:");
console.table(listEndpoints(app));

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
