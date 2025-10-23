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

export default function EditarUsuario({
  usuario,
  onClose,
  onUpdated,
}: {
  usuario: Usuario;
  onClose: () => void;
  onUpdated: (usuario: Usuario) => void;
}) {
  const [form, setForm] = useState({
    Nombre: usuario.Nombre,
    Apellido: usuario.Apellido,
    Telefono: usuario.Telefono,
    Correo: usuario.Correo,
    Rol: usuario.Rol,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.usuarios.update(usuario.Id_usuario, form);
      onUpdated({ ...usuario, ...form }); // 👈 actualiza tabla
      onClose();
    } catch (err) {
      console.error("❌ Error editando usuario:", err);
      alert("Error al editar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">✏️ Editar Usuario</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="Nombre"
            placeholder="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="Apellido"
            placeholder="Apellido"
            value={form.Apellido}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="Telefono"
            placeholder="Teléfono"
            value={form.Telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="Correo"
            type="email"
            placeholder="Correo"
            value={form.Correo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="Rol"
            value={form.Rol}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

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
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
