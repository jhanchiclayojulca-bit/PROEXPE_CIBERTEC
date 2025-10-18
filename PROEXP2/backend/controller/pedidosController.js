import { getConnection } from "../database/connection.js";

export const getPedidos = async (req, res) => {
  try {
    const pool = await getConnection();
    // 🔹 Usa el nombre correcto de la tabla: Pedido (no Pedidos)
    const result = await pool.request().query("SELECT * FROM Pedido");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};
