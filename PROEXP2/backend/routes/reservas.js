import { Router } from "express";
import { getReservas, createReserva } from "../controller/reservasController.js";

const router = Router();

router.get("/", getReservas);
router.post("/", createReserva);

export default router;
