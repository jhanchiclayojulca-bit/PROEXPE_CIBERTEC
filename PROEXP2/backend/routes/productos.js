import express from "express";
import { getConnection } from "../dbConfig.js";

const router = express.Router();

// GET /api/productos
router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Producto");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;