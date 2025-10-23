import { useState, useEffect } from "react";
import { Users, Plus, Search } from "lucide-react";
import { api } from "../services/api";
import CrearUsuario from "./CrearUsuario";
import EditarUsuario from "./EditarUsuario";

type Usuario = {
  Id_usuario: number;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  Correo: string;
  Rol: "admin" | "cliente";
  FechaRegistro: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrear, setShowCrear] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);
  const [search, setSearch] = useState("");

  const loadUsuarios = async () => {
    try {
      const data = await api.usuarios.getAll();
      setUsuarios(data);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleUsuarioCreado = (nuevo: Usuario) => {
    setUsuarios((prev) => [...prev, nuevo]);
  };

  const handleChangeRol = async (id: number, nuevoRol: "admin" | "cliente") => {
    try {
      await api.usuarios.updateRol(id, nuevoRol);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.Id_usuario === id ? { ...u, Rol: nuevoRol } : u
        )
      );
    } catch (err) {
      console.error("❌ Error actualizando rol:", err);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.usuarios.delete(id);
      setUsuarios((prev) => prev.filter((u) => u.Id_usuario !== id));
    } catch (err) {
      console.error("❌ Error eliminando usuario:", err);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.Apellido.toLowerCase().includes(search.toLowerCase()) ||
      u.Correo.toLowerCase().includes(search.toLowerCase()) ||
      u.Rol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* 🔎 buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, correo o rol..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowCrear(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-600 text-white">
              <tr>
                {[
                  "ID",
                  "Nombre",
                  "Apellido",
                  "Teléfono",
                  "Correo",
                  "Rol",
                  "Fecha Registro",
                  "Acciones",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((u) => (
                  <tr key={u.Id_usuario} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.Id_usuario}</td>
                    <td className="px-6 py-4 text-sm">{u.Nombre}</td>
                    <td className="px-6 py-4 text-sm">{u.Apellido}</td>
                    <td className="px-6 py-4 text-sm">{u.Telefono}</td>
                    <td className="px-6 py-4 text-sm">{u.Correo}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="relative inline-block">
                        <select
                          value={u.Rol}
                          onChange={(e) =>
                            handleChangeRol(u.Id_usuario, e.target.value as "admin" | "cliente")
                          }
                          className={`
                            appearance-none pr-8 pl-3 py-1.5 rounded-full font-semibold transition
                            ${u.Rol === "admin"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-green-600 text-white hover:bg-green-700"}
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                          `}
                        >
                          <option value="cliente">Cliente</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                          ▼
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(u.FechaRegistro).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => setUsuarioEdit(u)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(u.Id_usuario)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear */}
      {showCrear && (
        <CrearUsuario
          onClose={() => setShowCrear(false)}
          onCreated={handleUsuarioCreado}
        />
      )}

      {/* Modal editar */}
      {usuarioEdit && (
        <EditarUsuario
          usuario={usuarioEdit}
          onClose={() => setUsuarioEdit(null)}
          onUpdated={(updated) =>
            setUsuarios((prev) =>
              prev.map((u) =>
                u.Id_usuario === updated.Id_usuario ? updated : u
              )
            )
          }
        />
      )}
    </div>
  );
}
