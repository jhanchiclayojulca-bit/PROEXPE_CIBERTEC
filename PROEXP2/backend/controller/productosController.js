import { getConnection } from "../dbConfig.js";

export const getProductos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        Id_producto AS id_producto,
        Nombre_producto AS nombre_producto,
        Precio_unitario AS precio
      FROM Producto
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener productos", error: err.message });
  }
};
