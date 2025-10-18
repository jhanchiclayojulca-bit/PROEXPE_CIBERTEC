import { getConnection } from "../db.js";

// ================= GET ==================

// Obtener todas las facturas con nombre de empleado concatenado
export const getFacturas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT f.Id_factura, f.Fecha, f.Tipo, e.cod_empleado,
             COALESCE(p.nombre1,'') + ' ' + COALESCE(p.nombre2,'') + ' ' +
             COALESCE(p.apellido_paterno,'') + ' ' + COALESCE(p.apellido_materno,'') AS empleado
      FROM Factura f
      JOIN Empleado e ON f.cod_empleado = e.cod_empleado
      JOIN Persona p ON e.id_persona = p.id_persona
      ORDER BY f.Id_factura DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener facturas:", error);
    res.status(500).json({ message: "Error al obtener facturas", error: error.message });
  }
};

// Obtener detalle de una factura
export const getDetalleFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input("id", id)
      .query(`
        SELECT df.Id_detalle_factura, df.Cantidad, df.Subtotal, 
               pr.Nombre_producto, pr.Precio_unitario
        FROM Detalle_Factura df
        JOIN Producto pr ON df.Id_producto = pr.Id_producto
        WHERE df.Id_factura = @id
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener detalle de factura:", error);
    res.status(500).json({ message: "Error al obtener detalle", error: error.message });
  }
};

// ================= POST ==================

// Crear una factura con detalle
export const createFactura = async (req, res) => {
  const { cod_empleado, Fecha, Tipo, detalle } = req.body;

  if (!cod_empleado || !Fecha || !Tipo || !detalle || detalle.length === 0) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await getConnection();

    // Insertar factura y obtener Id_factura generado
    const resultFactura = await pool.request()
      .input("cod_empleado", cod_empleado)
      .input("Fecha", Fecha)
      .input("Tipo", Tipo)
      .query(`
        INSERT INTO Factura (cod_empleado, Fecha, Tipo)
        OUTPUT INSERTED.Id_factura
        VALUES (@cod_empleado, @Fecha, @Tipo)
      `);

    const Id_factura = resultFactura.recordset[0].Id_factura;

    // Insertar detalle de la factura
    for (const item of detalle) {
      await pool.request()
        .input("Id_factura", Id_factura)
        .input("Id_producto", item.Id_producto)
        .input("Cantidad", item.Cantidad)
        .input("Subtotal", item.Subtotal)
        .query(`
          INSERT INTO Detalle_Factura (Id_factura, Id_producto, Cantidad, Subtotal)
          VALUES (@Id_factura, @Id_producto, @Cantidad, @Subtotal)
        `);
    }

    res.status(201).json({ message: "Factura creada correctamente", Id_factura });
  } catch (error) {
    console.error("❌ Error al crear factura:", error);
    res.status(500).json({ message: "Error al crear factura", error: error.message });
  }
};
