import express from "express";
import { getProductos, createProducto } from "../controller/productoController.js";

const router = express.Router();

// Rutas GET y POST
router.get("/", getProductos);     // GET todos los productos
router.post("/", createProducto);  // POST nuevo producto

export default router;
