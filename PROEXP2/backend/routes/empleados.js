import express from "express";
import { getEmpleados } from "../controller/empleadosController.js";

const router = express.Router();

/* ============================
   🔹 Rutas de Empleados
   ============================ */
router.get("/", getEmpleados);

export default router;
