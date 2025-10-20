import express from "express";
import { getSedes } from "../controller/sedeController.js";

const router = express.Router();

router.get("/", getSedes);

export default router;
