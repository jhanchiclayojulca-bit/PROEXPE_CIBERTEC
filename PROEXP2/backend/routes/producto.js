import express from "express";
import { getProductos, createProducto, deleteProducto, updateProducto } from "../controller/productoController.js";

const router = express.Router();

// Rutas GET y POST
router.get("/", getProductos);     // GET todos los productos
router.post("/", createProducto);  // POST nuevo producto
router.delete("/:id", deleteProducto); // DELETE producto por ID
router.put("/:id", updateProducto); // PUT actualizar producto por ID

export default router;
