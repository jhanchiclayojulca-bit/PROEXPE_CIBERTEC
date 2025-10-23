import express from "express";
import { getUsuarios, actualizarRol, createUsuario, actualizarUsuario, eliminarUsuario } from "../controller/usuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);        // 👈 CREAR
router.put("/:id", actualizarUsuario);      // 👈 EDITAR
router.patch("/:id/rol", actualizarRol);
router.delete("/:id", eliminarUsuario);   // 👈 ELIMINAR

export default router;
