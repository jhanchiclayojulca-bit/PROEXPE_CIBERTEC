import { useState } from "react";
import { User, X } from "lucide-react";

export default function PerfilUsuario() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [editando, setEditando] = useState(false);

  const [usuario, setUsuario] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "999 999 999",
    tipo: "Cliente",
    correo: "cliente1@gmail.com",
    contraseña: "********",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = () => {
    setEditando(false);
    alert("✅ Perfil actualizado correctamente");
  };

  return (
    <div className="relative">
      {/* Botón de Perfil */}
      <button
        onClick={() => setMostrarPerfil(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-all"
      >
        <User className="w-5 h-5" />
        Perfil
      </button>

      {/* Modal */}
      {mostrarPerfil && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] relative animate-fadeIn">
            {/* Botón cerrar */}
            <button
              onClick={() => setMostrarPerfil(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">
              Perfil del Usuario
            </h2>

            <div className="space-y-4 text-gray-700">
              {[
                { label: "Nombre", name: "nombre", placeholder: "Tu nombre" },
                { label: "Apellido", name: "apellido", placeholder: "Tu apellido" },
                { label: "Teléfono", name: "telefono", placeholder: "999 999 999" },
                { label: "Correo Electrónico", name: "correo", placeholder: "ejemplo@gmail.com" },
                { label: "Contraseña", name: "contraseña", placeholder: "********" },
              ].map((campo) => (
                <div key={campo.name}>
                  <label className="block text-sm font-medium mb-1 text-gray-600">
                    {campo.label}
                  </label>
                  <input
                    type={campo.name === "contraseña" ? "password" : "text"}
                    name={campo.name}
                    value={usuario[campo.name as keyof typeof usuario]}
                    onChange={handleChange}
                    readOnly={!editando}
                    placeholder={campo.placeholder}
                    className={`w-full rounded-lg border p-2.5 outline-none transition ${
                      editando
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
                        : "bg-gray-100 border-gray-300 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Tipo de Usuario
                </label>
                <select
                  name="tipo"
                  value={usuario.tipo}
                  onChange={handleChange}
                  disabled={!editando}
                  className={`w-full rounded-lg border p-2.5 outline-none transition ${
                    editando
                      ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
                      : "bg-gray-100 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  <option>Cliente</option>
                  <option>Administrador</option>
                </select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex gap-3">
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={guardarCambios}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all"
                >
                  Guardar Cambios
                </button>
              )}

              <button
                onClick={() => setMostrarPerfil(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-xl hover:bg-gray-400 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
