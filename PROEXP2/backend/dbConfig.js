import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER, // ejemplo: "localhost\\SQLEXPRESS"
  database: process.env.SQL_DATABASE,
  port: 1434, // si sabes el puerto correcto del motor, sino quítalo y usa instancia nombrada
  options: {
    encrypt: false,
    trustServerCertificate: true, // necesario para SQL Server local
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión a SQL Server exitosa ✅");
    return pool;
  } catch (err) {
    console.error("Error de conexión a SQL Server:", err);
  }
}

export { dbConfig };
