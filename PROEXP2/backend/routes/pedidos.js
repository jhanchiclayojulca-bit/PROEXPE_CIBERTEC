import express from "express";
import { getConnection } from "../dbConfig.js";

const router = express.Router();

/* ============================
   🔹 GET /api/pedidos
   🔹 Opcional: ?cod_cliente=xxx para filtrar pedidos del cliente
   ============================ */
router.get("/", async (req, res) => {
  try {
    const { cod_cliente } = req.query;
    const pool = await getConnection();

    let query = "SELECT * FROM Pedido";
    if (cod_cliente) query += " WHERE cod_cliente = @cod_cliente";

    const request = pool.request();
    if (cod_cliente) request.input("cod_cliente", cod_cliente);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err.message);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
});

/* ============================
   🔹 GET /api/pedidos/:id/detalle
   ============================ */
router.get("/:id/detalle", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input("id", id)
      .query(`
        SELECT 
          dp.id_detalle_pedido,
          pr.Nombre_producto,
          pr.Precio_unitario,
          dp.Cantidad,
          dp.Subtotal
        FROM Detalle_Pedido dp
        INNER JOIN Producto pr ON dp.Id_producto = pr.Id_producto
        WHERE dp.Nro_pedido = @id
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener detalle del pedido:", err);
    res.status(500).json({ message: "Error al obtener detalle del pedido" });
  }
});

/* ============================
   🔹 POST /api/pedidos
   ============================ */
router.post("/", async (req, res) => {
  const { Nro_pedido, fecha_pedido, cod_cliente, cod_empleado, detalles } = req.body;

  if (!Nro_pedido || !fecha_pedido || !cod_cliente || !detalles) {
    return res.status(400).json({ message: "Faltan datos obligatorios del pedido" });
  }

  try {
    const pool = await getConnection();

    // Insertar pedido
    await pool.request()
      .input("Nro_pedido", Nro_pedido)
      .input("fecha_pedido", fecha_pedido)
      .input("cod_cliente", cod_cliente)
      .input("cod_empleado", cod_empleado || null) // Null si es cliente
      .query(`
        INSERT INTO Pedido (Nro_pedido, fecha_pedido, cod_cliente, cod_empleado)
        VALUES (@Nro_pedido, @fecha_pedido, @cod_cliente, @cod_empleado)
      `);

    // Insertar detalles
    for (const d of detalles) {
      await pool.request()
        .input("id_detalle_pedido", d.id_detalle_pedido)
        .input("Nro_pedido", Nro_pedido)
        .input("Id_producto", d.Id_producto)
        .input("Cantidad", d.Cantidad)
        .input("Subtotal", d.Subtotal)
        .query(`
          INSERT INTO Detalle_Pedido (id_detalle_pedido, Nro_pedido, Id_producto, Cantidad, Subtotal)
          VALUES (@id_detalle_pedido, @Nro_pedido, @Id_producto, @Cantidad, @Subtotal)
        `);
    }

    res.json({ message: "✅ Pedido creado correctamente" });
  } catch (err) {
    console.error("❌ Error al crear pedido:", err);
    res.status(500).json({ message: "Error al crear pedido" });
  }
});

export default router;
