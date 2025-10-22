import { getConnection, sql } from "../dbConfig.js";

/* ============================
   🔹 Obtener todos los productos
   ============================ */
export const getProductos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT Id_producto, Nombre_producto, Categoria, CAST(Precio_unitario AS FLOAT) AS Precio_unitario
        FROM Producto


    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

/* ============================
   🔹 Crear producto
   ============================ */
export const createProducto = async (req, res) => {
  try {
    const { Nombre_producto, Categoria, Precio_unitario } = req.body;

    if (!Nombre_producto || !Categoria || Precio_unitario == null) {
      return res.status(400).json({ message: "⚠️ Faltan datos obligatorios" });
    }

    const pool = await getConnection();

    const result = await pool.request()
      .input("Nombre_producto", sql.VarChar(50), Nombre_producto)
      .input("Categoria", sql.VarChar(30), Categoria)
      .input("Precio_unitario", sql.Decimal(10, 2), Precio_unitario)
      .query(`
        INSERT INTO Producto (Nombre_producto, Categoria, Precio_unitario)
        OUTPUT INSERTED.Id_producto, INSERTED.Nombre_producto, INSERTED.Categoria, INSERTED.Precio_unitario
        VALUES (@Nombre_producto, @Categoria, @Precio_unitario)
      `);

    // Devolvemos el producto recién insertado
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};