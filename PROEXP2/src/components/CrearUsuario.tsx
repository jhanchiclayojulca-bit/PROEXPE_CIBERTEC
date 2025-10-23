import { useState } from "react";
import { api } from "../services/api";

type Usuario = {
  Id_usuario: number;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  Correo: string;
  Rol: "admin" | "cliente";
  FechaRegistro: string;
};

export default function CrearUsuario({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (usuario: Usuario) => void;
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nuevo = await api.usuarios.create(form); // 👈 manda los campos al backend
      onCreated(nuevo); // 👈 actualiza la tabla en Usuarios
      onClose(); // 👈 cierra modal
    } catch (err) {
      console.error("❌ Error creando usuario:", err);
      alert("Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">➕ Crear Usuario</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {loading ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
