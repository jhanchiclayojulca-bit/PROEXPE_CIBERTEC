import { getConnection, sql } from "../db.js";

// Crear cliente
export const crearCliente = async (req, res) => {
  const { nombre_cliente } = req.body;
  if (!nombre_cliente) {
    return res.status(400).json({ message: "Falta el nombre del cliente" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("nombre_cliente", sql.NVarChar(100), nombre_cliente)
      .query(`
        INSERT INTO Cliente (nombre_cliente) 
        OUTPUT INSERTED.cod_cliente, INSERTED.nombre_cliente 
        VALUES (@nombre_cliente)
      `);

    res.json(result.recordset[0]); // { cod_cliente, nombre_cliente }
  } catch (err) {
    console.error("❌ Error al crear cliente:", err);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

// Obtener clientes
export const getClientes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT cod_cliente, nombre_cliente
      FROM Cliente
      ORDER BY cod_cliente DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener clientes:", err);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};
