import { Router } from "express";
import { getFacturas, getDetalleFactura, createFactura } from "../controller/facturaController.js";

const router = Router();

router.get("/", getFacturas);
router.get("/:id", getDetalleFactura);
router.post("/", createFactura);

export default router;
