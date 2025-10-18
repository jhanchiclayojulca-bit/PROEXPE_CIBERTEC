import { Router } from "express";
import { getConnection } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Sede");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener sedes" });
  }
});

export default router;
