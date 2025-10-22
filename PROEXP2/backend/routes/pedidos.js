import express from "express";
import { getConnection, sql } from "../db.js";

const router = express.Router();

/* ============================
   🔹 GET /api/pedidos
   🔹 Opcional: ?cod_cliente=xxx
   ============================ */
   // GET /api/pedidos
router.get("/", async (req, res) => {
  try {
    const { cod_cliente } = req.query;
    const pool = await getConnection();

let query = `
  SELECT 
        p.id_pedido,
        FORMAT(p.fecha_pedido, 'yyyy-MM-dd') AS fecha_pedido,
        c.nombre_cliente,
        per.nombre1 + ' ' + ISNULL(per.nombre2,'') + ' ' + per.apellido_paterno AS empleado_nombre
  FROM Pedido p
  JOIN Cliente c ON p.cod_cliente = c.cod_cliente
  JOIN Empleado e ON p.cod_empleado = e.cod_empleado
  JOIN Persona per ON e.id_persona = per.id_persona
`;



    if (cod_cliente) query += " WHERE c.cod_cliente = @cod_cliente";

    const request = pool.request();
    if (cod_cliente) request.input("cod_cliente", cod_cliente);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ message: "Error al obtener pedidos", error: err.message });
  }
});

  
// GET /api/pedidos/:id/detalle
router.get("/:id/detalle", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("id_pedido", id)
      .query(`
        SELECT 
              dp.id_detalle, 
              dp.Id_producto,          -- 👈 agregado
              p.Nombre_producto, 
              p.Precio_unitario, 
              dp.Cantidad, 
              dp.Subtotal
          FROM Detalle_Pedido dp
          INNER JOIN Producto p ON dp.Id_producto = p.Id_producto
          WHERE dp.id_pedido = @id_pedido

      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener detalle:", err);
    res.status(500).json({ message: "Error al obtener detalle del pedido" });
  }
});

 
  
  
/* ============================
   🔹 POST /api/pedidos
   ============================ */
router.post("/", async (req, res) => {
  const { fecha_pedido, cod_cliente, cod_empleado, detalles } = req.body;

  if (!fecha_pedido || !cod_cliente || !cod_empleado || !detalles) {
    return res.status(400).json({ message: "Faltan datos obligatorios del pedido" });
  }

  try {
    const pool = await getConnection();

    // Insertar pedido
    const pedidoResult = await pool.request()
      .input("fecha_pedido", sql.Date, fecha_pedido)
      .input("cod_cliente", cod_cliente)
      .input("cod_empleado", cod_empleado)
      .query(`
        INSERT INTO Pedido (fecha_pedido, cod_cliente, cod_empleado)
        OUTPUT INSERTED.id_pedido
        VALUES (@fecha_pedido, @cod_cliente, @cod_empleado)
      `);

    const newPedido = pedidoResult.recordset[0];

    // ✅ Recorremos todos los detalles
    for (const d of detalles) {
      await pool.request()
        .input("id_pedido", newPedido.id_pedido)
        .input("Id_producto", d.Id_producto)
        .input("Cantidad", d.Cantidad)
        .query(`
          INSERT INTO Detalle_Pedido (id_pedido, Id_producto, Cantidad, Subtotal)
          SELECT @id_pedido, @Id_producto, @Cantidad, p.Precio_unitario * @Cantidad
          FROM Producto p
          WHERE p.Id_producto = @Id_producto
        `);
    }

    // 🔄 Recuperar pedido completo con joins
const pedidoCompleto = await pool.request()
  .input("id_pedido", newPedido.id_pedido)
  .query(`
    SELECT 
      p.id_pedido,
      FORMAT(p.fecha_pedido, 'yyyy-MM-dd') AS fecha_pedido,
      c.nombre_cliente,
      per.nombre1 + ' ' + ISNULL(per.nombre2,'') + ' ' + per.apellido_paterno AS empleado_nombre
    FROM Pedido p
    JOIN Cliente c ON p.cod_cliente = c.cod_cliente
    JOIN Empleado e ON p.cod_empleado = e.cod_empleado
    JOIN Persona per ON e.id_persona = per.id_persona
    WHERE p.id_pedido = @id_pedido
  `);

    res.json({ message: "✅ Pedido creado correctamente", pedido: pedidoCompleto.recordset[0] });
  } catch (err) {
    console.error("❌ Error al crear pedido:", err);
    res.status(500).json({ message: "Error al crear pedido", error: err.message });
  }
});


export default router;
