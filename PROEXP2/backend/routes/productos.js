import express from "express";
import { getProductos } from "../controller/productosController.js";

const router = express.Router();
router.get("/", getProductos);

export default router;
