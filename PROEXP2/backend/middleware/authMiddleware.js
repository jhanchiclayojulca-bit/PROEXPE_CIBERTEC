import { getConnection, sql } from "../db.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const pool = await getConnection();
    const result = await pool.request()
      .input("Token", sql.NVarChar, token)
      .query("SELECT * FROM Sesion WHERE Token = @Token AND Activa = 1");

    if (result.recordset.length === 0) {
      return res.status(403).json({ message: "Sesión no válida o expirada" });
    }

    req.user = decoded; // id y rol
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};
