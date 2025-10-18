// routes/factura.js
import express from "express";
import { getFacturas } from "../controller/facturaController.js";

const router = express.Router();

// GET /api/factura → listar todas las facturas
router.get("/", getFacturas);

console.log("Factura router cargado correctamente");

export default router;
