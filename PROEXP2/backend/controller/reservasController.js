import { getConnection, sql } from "../db.js";

export const getReservas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT r.cod_reserva, r.cod_cliente, r.cod_sede, r.fecha, r.hora,
             r.cantidad_personas, r.comentario,
             s.nombre_sede
      FROM Reserva r
      LEFT JOIN Sede s ON r.cod_sede = s.cod_sede
      ORDER BY r.cod_reserva DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    res.status(500).json({ message: "Error al obtener reservas", error: error.message });
  }
};

export const createReserva = async (req, res) => {
  const { cod_cliente, cod_sede, fecha, hora, cantidad_personas, comentario } = req.body;

  if (!cod_cliente || !cod_sede || !fecha || !hora || !cantidad_personas) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  try {
    const pool = await getConnection();
    const empleadoResult = await pool.request().query(`
      SELECT TOP 1 cod_empleado
      FROM Empleado
      WHERE estado = 'Activo'
      ORDER BY NEWID()  -- seleccionar uno al azar
    `);
    const cod_empleado = empleadoResult.recordset[0]?.cod_empleado || null;

    const result = await pool.request()
      .input("cod_cliente", sql.VarChar, cod_cliente)
      .input("cod_sede", sql.VarChar, cod_sede)
      .input("fecha", sql.Date, fecha)
      .input("hora", sql.Time, hora)
      .input("cantidad_personas", sql.Int, cantidad_personas)
      .input("comentario", sql.VarChar, comentario || "")
      .query(`
        INSERT INTO Reserva (cod_cliente, cod_sede, fecha, hora, cantidad_personas, comentario)
        OUTPUT INSERTED.cod_reserva
        VALUES (@cod_cliente, @cod_sede, @fecha, @hora, @cantidad_personas, @comentario)
      `);

    const cod_reserva = result.recordset[0].cod_reserva;
    res.status(201).json({ message: "Reserva creada correctamente", cod_reserva });
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    res.status(500).json({ message: "Error al crear reserva", error: error.message });
  }
};
