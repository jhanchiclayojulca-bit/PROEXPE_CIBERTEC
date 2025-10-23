import { getConnection, sql } from "../db.js";

/* ============================
   🔹 Obtener todas las facturas
   ============================ */
export const getFacturas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        f.Id_factura,
        FORMAT(f.Fecha, 'yyyy-MM-dd') AS Fecha,
        CONVERT(VARCHAR(5), f.Hora, 108) AS Hora,
        f.Tipo,
        per.nombre1 + ' ' + ISNULL(per.nombre2, '') + ' ' + per.apellido_paterno AS empleado
      FROM Factura f
      JOIN Empleado e ON f.cod_empleado = e.cod_empleado
      JOIN Persona per ON e.id_persona = per.id_persona
      ORDER BY f.Id_factura DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener facturas:", err);
    res.status(500).json({ message: "Error al obtener facturas", error: err.message });
  }
};

/* ============================
   🔹 Obtener detalle de una factura
   ============================ */
export const getDetalleFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input("Id_factura", sql.Int, id)
      .query(`
        SELECT 
          df.Id_detalle_factura,
          p.Nombre_producto,
          p.Precio_unitario,
          df.Cantidad,
          df.Subtotal
        FROM Detalle_Factura df
        JOIN Producto p ON df.Id_producto = p.Id_producto
        WHERE df.Id_factura = @Id_factura
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener detalle factura:", err);
    res.status(500).json({ message: "Error al obtener detalle factura", error: err.message });
  }
};

/* ============================
   🔹 Crear una nueva factura
   ============================ */
export const createFactura = async (req, res) => {
  const { cod_empleado, Tipo, detalle } = req.body;

  if (!cod_empleado || !detalle || detalle.length === 0) {
    return res.status(400).json({ message: "Faltan datos obligatorios de la factura" });
  }

  try {
    const pool = await getConnection();

    // 1️⃣ Insertar cabecera de factura
    const facturaResult = await pool.request()
      .input("cod_empleado", cod_empleado)
      .input("Tipo", Tipo || "Factura")
      .query(`
        INSERT INTO Factura (cod_empleado, Tipo)
        OUTPUT INSERTED.Id_factura, INSERTED.Fecha, INSERTED.Hora, INSERTED.Tipo
        VALUES (@cod_empleado, @Tipo)
      `);

    const newFactura = facturaResult.recordset[0];

    // 2️⃣ Insertar detalle (calculando subtotal desde BD)
    for (const d of detalle) {
      await pool.request()
        .input("Id_factura", newFactura.Id_factura)
        .input("Id_producto", d.Id_producto)
        .input("Cantidad", d.Cantidad)
        .query(`
          INSERT INTO Detalle_Factura (Id_factura, Id_producto, Cantidad, Subtotal)
          SELECT @Id_factura, @Id_producto, @Cantidad, p.Precio_unitario * @Cantidad
          FROM Producto p
          WHERE p.Id_producto = @Id_producto
        `);
    }

    // 3️⃣ Recuperar factura completa con empleado
    const facturaCompleta = await pool.request()
      .input("Id_factura", newFactura.Id_factura)
      .query(`
        SELECT 
          f.Id_factura,
          FORMAT(f.Fecha, 'yyyy-MM-dd') AS Fecha,
          CONVERT(VARCHAR(5), f.Hora, 108) AS Hora,
          f.Tipo,
          per.nombre1 + ' ' + ISNULL(per.nombre2, '') + ' ' + per.apellido_paterno AS empleado
        FROM Factura f
        JOIN Empleado e ON f.cod_empleado = e.cod_empleado
        JOIN Persona per ON e.id_persona = per.id_persona
        WHERE f.Id_factura = @Id_factura
      `);

    res.json({
      message: "✅ Factura creada correctamente",
      factura: facturaCompleta.recordset[0]
    });

  } catch (err) {
    console.error("❌ Error al crear factura:", err);
    res.status(500).json({ message: "Error al crear factura", error: err.message });
  }
};


/* ============================
   🔹 Eliminar factura por ID
   ============================ */
export const deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    // Primero eliminamos detalles
    await pool.request()
      .input("Id_factura", sql.Int, id)
      .query("DELETE FROM Detalle_Factura WHERE Id_factura = @Id_factura");

    // Luego eliminamos la factura
    await pool.request()
      .input("Id_factura", sql.Int, id)
      .query("DELETE FROM Factura WHERE Id_factura = @Id_factura");

    res.json({ message: "🗑️ Factura eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar factura:", err);
    res.status(500).json({ message: "Error al eliminar factura", error: err.message });
  }
};
