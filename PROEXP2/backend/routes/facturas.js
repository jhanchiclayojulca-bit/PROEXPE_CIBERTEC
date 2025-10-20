import express from "express";
import { getFacturas, getDetalleFactura, createFactura } from "../controller/facturaController.js";

const router = express.Router();

router.get("/", getFacturas);             // GET todas las facturas
router.get("/:id/detalle", getDetalleFactura);
router.post("/", createFactura);          // POST nueva factura

export default router;
