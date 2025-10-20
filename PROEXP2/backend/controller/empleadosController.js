import { getConnection } from "../dbConfig.js";

/**
 * 🔹 Obtener todos los empleados
 */
export const getEmpleados = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        e.cod_empleado AS id,
        per.nombre1 + ' ' + ISNULL(per.nombre2, '') + ' ' + per.apellido_paterno AS nombre
      FROM Empleado e
      INNER JOIN Persona per ON e.id_persona = per.id_persona
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener empleados:", err);
    res.status(500).json({ message: "Error al obtener empleados" });
  }
};
