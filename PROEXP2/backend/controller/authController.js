import { getConnection, sql } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta";

// 🔹 Registro
export const register = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, password } = req.body;

    // 🔒 forzamos rol = cliente siempre
    const rol = "cliente";

    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getConnection();

    await pool.request()
      .input("Nombre", sql.NVarChar, nombre)
      .input("Apellido", sql.NVarChar, apellido)
      .input("Telefono", sql.NVarChar, telefono)
      .input("Correo", sql.NVarChar, email)
      .input("Contrasena", sql.NVarChar, hashedPassword)
      .input("Rol", sql.NVarChar, rol)
      .query(`
        INSERT INTO Usuario (Nombre, Apellido, Telefono, Correo, Contrasena, Rol)
        VALUES (@Nombre, @Apellido, @Telefono, @Correo, @Contrasena, @Rol)
      `);

    res.json({ message: "✅ Registro exitoso" });
  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};


// 🔹 Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Correo", sql.NVarChar, email)
      .query("SELECT * FROM Usuario WHERE Correo = @Correo");

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.Contrasena);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    // generar token JWT
    const token = jwt.sign(
      { id: user.Id_usuario, rol: user.Rol },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // guardar sesión
    await pool.request()
      .input("Id_usuario", sql.Int, user.Id_usuario)
      .input("Token", sql.NVarChar, token)
      .input("FechaExpiracion", sql.DateTime, new Date(Date.now() + 2 * 60 * 60 * 1000))
      .query(`
        INSERT INTO Sesion (Id_usuario, Token, FechaExpiracion)
        VALUES (@Id_usuario, @Token, @FechaExpiracion)
      `);

    res.json({
      message: "✅ Login exitoso",
      token,
      rol: user.Rol,
      nombre: user.Nombre
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error en login" });
  }
};

// 🔹 Logout
export const logout = async (req, res) => {
  const { token } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input("Token", sql.NVarChar, token)
      .query("UPDATE Sesion SET Activa = 0 WHERE Token = @Token");
    res.json({ message: "✅ Sesión cerrada" });
  } catch (err) {
    console.error("❌ Error en logout:", err);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
