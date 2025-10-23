import { getConnection, sql } from "../db.js";
import bcrypt from "bcryptjs";


// GET todos los usuarios (sin contraseña)
export const getUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        Id_usuario, 
        Nombre, 
        Apellido, 
        Telefono, 
        Correo, 
        Rol, 
        FechaRegistro
      FROM Usuario
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};


// 📌 Crear usuario
export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, telefono, correo, contrasena } = req.body;

    console.log("📩 Datos recibidos en createUsuario:", req.body);

    // Validaciones básicas
    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const rol = "cliente"; // 👈 por defecto siempre cliente
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const pool = await getConnection();
    const result = await pool.request()
      .input("Nombre", sql.NVarChar, nombre)
      .input("Apellido", sql.NVarChar, apellido)
      .input("Telefono", sql.NVarChar, telefono || "")
      .input("Correo", sql.NVarChar, correo)
      .input("Contrasena", sql.NVarChar, hashedPassword)
      .input("Rol", sql.NVarChar, rol)
      .query(`
        INSERT INTO Usuario (Nombre, Apellido, Telefono, Correo, Contrasena, Rol)
        OUTPUT INSERTED.Id_usuario, INSERTED.Nombre, INSERTED.Apellido, INSERTED.Telefono,
               INSERTED.Correo, INSERTED.Rol, INSERTED.FechaRegistro
        VALUES (@Nombre, @Apellido, @Telefono, @Correo, @Contrasena, @Rol)
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error creando usuario:", err);
    res.status(500).json({ message: "Error al crear usuario", error: err.message });
  }
};
/* 🔹 Actualizar usuario */
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Apellido, Correo, Rol } = req.body;

    const pool = await getConnection();
    await pool.request()
      .input("Id_usuario", sql.Int, id)
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Apellido", sql.NVarChar, Apellido)
      .input("Correo", sql.NVarChar, Correo)
      .input("Rol", sql.NVarChar, Rol)
      .query(`
        UPDATE Usuario
        SET Nombre=@Nombre, Apellido=@Apellido, Correo=@Correo, Rol=@Rol
        WHERE Id_usuario=@Id_usuario
      `);

    res.json({ message: "✅ Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

/* 🔹 Eliminar usuario */
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();
    await pool.request()
      .input("Id_usuario", sql.Int, id)
      .query("DELETE FROM Usuario WHERE Id_usuario=@Id_usuario");

    res.json({ message: "🗑️ Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

/* 🔹 Cambiar solo el rol */
export const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || !["admin", "cliente"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const pool = await getConnection();
    await pool.request()
      .input("Id_usuario", sql.Int, id)
      .input("Rol", sql.NVarChar, rol)
      .query("UPDATE Usuario SET Rol=@Rol WHERE Id_usuario=@Id_usuario");

    res.json({ message: "✅ Rol actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar rol:", err);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};
