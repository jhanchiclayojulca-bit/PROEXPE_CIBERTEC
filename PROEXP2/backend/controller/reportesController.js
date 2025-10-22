import { getConnection, sql } from "../db.js";

// Ventas del día
export const getVentasDelDia = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT ISNULL(SUM(df.Subtotal), 0) AS VentasDia
      FROM Factura f
      JOIN Detalle_Factura df ON f.Id_factura = df.Id_factura
      WHERE CAST(f.Fecha AS DATE) = CAST(GETDATE() AS DATE)
    `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error ventas del día:", err);
    res.status(500).json({ message: "Error ventas del día" });
  }
};

// Pedidos activos
export const getPedidosActivos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT COUNT(*) AS PedidosActivos FROM Pedido
    `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error pedidos activos:", err);
    res.status(500).json({ message: "Error pedidos activos" });
  }
};

// Facturas emitidas hoy
export const getFacturasEmitidas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT COUNT(*) AS FacturasEmitidas
      FROM Factura
      WHERE CAST(Fecha AS DATE) = CAST(GETDATE() AS DATE)
    `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error facturas emitidas:", err);
    res.status(500).json({ message: "Error facturas emitidas" });
  }
};

// Reservas hoy
export const getReservasHoy = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT COUNT(*) AS ReservasHoy
      FROM Reserva
      WHERE CAST(fecha AS DATE) = CAST(GETDATE() AS DATE)
    `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error reservas hoy:", err);
    res.status(500).json({ message: "Error reservas hoy" });
  }
};

// Productos más vendidos
export const getProductosMasVendidos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 5 p.Nombre_producto, SUM(dp.Cantidad) AS TotalVendidos
      FROM Detalle_Pedido dp
      JOIN Producto p ON dp.Id_producto = p.Id_producto
      GROUP BY p.Nombre_producto
      ORDER BY TotalVendidos DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error productos más vendidos:", err);
    res.status(500).json({ message: "Error productos más vendidos" });
  }
};

// Rendimiento empleados
export const getRendimientoEmpleados = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT TOP 5 
        (p.nombre1 + ' ' + p.apellido_paterno) AS Empleado,
        COUNT(pe.id_pedido) AS TotalPedidos,
        SUM(df.Subtotal) AS TotalVentas
      FROM Empleado e
      JOIN Persona p ON e.id_persona = p.id_persona
      JOIN Pedido pe ON pe.cod_empleado = e.cod_empleado
      JOIN Factura f ON f.cod_empleado = e.cod_empleado
      JOIN Detalle_Factura df ON df.Id_factura = f.Id_factura
      GROUP BY p.nombre1, p.apellido_paterno
      ORDER BY TotalVentas DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error rendimiento empleados:", err);
    res.status(500).json({ message: "Error rendimiento empleados" });
  }
};
