import express from "express";
import { getFacturas, getDetalleFactura, createFactura , deleteFactura} from "../controller/facturaController.js";

const router = express.Router();

router.get("/", getFacturas);             // GET todas las facturas
router.get("/:id/detalle", getDetalleFactura);
router.post("/", createFactura);          // POST nueva factura
router.delete("/:id", deleteFactura);     // DELETE factura por ID

export default router;
