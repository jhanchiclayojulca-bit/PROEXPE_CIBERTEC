import { getConnection } from "../db.js";

// 🔹 Obtener todas las sedes
export const getSedes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT cod_sede, nombre_sede, direccion
      FROM Sede
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener sedes:", err);
    res.status(500).json({ message: "Error al obtener sedes", error: err.message });
  }
};
