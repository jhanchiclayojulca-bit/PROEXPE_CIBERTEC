import express from "express";
import { crearCliente, getClientes } from "../controller/clientesController.js";

const router = express.Router();

router.post("/", crearCliente);
router.get("/", getClientes);

export default router;
