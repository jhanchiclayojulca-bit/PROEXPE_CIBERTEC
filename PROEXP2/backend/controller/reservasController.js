import { getConnection, sql } from "../db.js";

// ✅ Obtener todas las reservas con cliente y sede
export async function obtenerReservas(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        r.cod_reserva, 
        c.nombre_cliente, 
        s.nombre_sede, 
        r.fecha, 
        r.hora, 
        r.cantidad_personas, 
        r.comentario
      FROM Reserva r
      LEFT JOIN Cliente c ON r.cod_cliente = c.cod_cliente
      LEFT JOIN Sede s ON r.cod_sede = s.cod_sede
    `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error.message);
    res.status(500).json({ message: "Error al obtener reservas", error: error.message });
  }
}

  

// ✅ Crear cliente y reserva en una sola transacción con validación
export async function crearReserva(req, res) {
  try {
    const { nombre_cliente, cod_sede, fecha, hora, cantidad_personas, comentario } = req.body;

    if (!nombre_cliente) {
      return res.status(400).json({ message: "El nombre del cliente es obligatorio" });
    }

    // Normalizar hora al formato HH:mm
    let horaNormalizada = hora;
    if (hora && hora.length >= 5) {
      horaNormalizada = hora.substring(0, 5); // "18:30:00" -> "18:30"
    }

    const pool = await getConnection();

    // 🔍 1️⃣ Verificar si el cliente ya existe
    const clienteExistente = await pool.request()
      .input("nombre_cliente", sql.NVarChar(100), nombre_cliente)
      .query(`SELECT cod_cliente FROM Cliente WHERE nombre_cliente = @nombre_cliente`);

    let cod_cliente;

    if (clienteExistente.recordset.length > 0) {
      // ✅ Si existe, usar ese cod_cliente
      cod_cliente = clienteExistente.recordset[0].cod_cliente;
    } else {
      // 🚀 Si no existe, crearlo
      const clienteResult = await pool.request()
        .input("nombre_cliente", sql.NVarChar(100), nombre_cliente)
        .query(`
          INSERT INTO Cliente (nombre_cliente)
          OUTPUT INSERTED.cod_cliente
          VALUES (@nombre_cliente)
        `);
      cod_cliente = clienteResult.recordset[0].cod_cliente;
    }

    // 2️⃣ Crear la reserva
    await pool.request()
      .input("cod_cliente", sql.Int, cod_cliente)
      .input("cod_sede", sql.Int, cod_sede)
      .input("fecha", sql.Date, fecha)
      .input("hora", sql.VarChar(5), horaNormalizada)
      .input("cantidad_personas", sql.Int, cantidad_personas)
      .input("comentario", sql.VarChar(400), comentario)
      .query(`
        INSERT INTO Reserva (cod_cliente, cod_sede, fecha, hora, cantidad_personas, comentario)
        VALUES (@cod_cliente, @cod_sede, @fecha, @hora, @cantidad_personas, @comentario)
      `);

    res.json({ message: "✅ Reserva creada correctamente", cod_cliente });
  } catch (error) {
    console.error("❌ Error al crear reserva:", error.message);
    res.status(500).json({ message: "Error al crear reserva", error: error.message });
  }
}