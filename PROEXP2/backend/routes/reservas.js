import express from "express";
import { obtenerReservas, crearReserva } from "../controller/reservasController.js";

const router = express.Router();

// ✅ Obtener todas las reservas
router.get("/", obtenerReservas);

// ✅ Crear una nueva reserva
router.post("/", crearReserva);

export default router;
