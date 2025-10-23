import express from "express";
import { obtenerReservas, crearReserva, eliminarReserva } from "../controller/reservasController.js";

const router = express.Router();

// ✅ Obtener todas las reservas
router.get("/", obtenerReservas);

// ✅ Crear una nueva reserva
router.post("/", crearReserva);
// ✅ Eliminar una reserva por su ID
router.delete("/:id", eliminarReserva);

export default router;
