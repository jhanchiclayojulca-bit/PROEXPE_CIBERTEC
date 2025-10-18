import { useState } from 'react';
import { User } from 'lucide-react';

export default function PerfilUsuario() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Datos simulados del usuario
  const usuario = {
    nombre: 'Juan Pérez',
    correo: 'juanperez@cibertec.edu.pe',
    rol: 'Administrador',
    sede: 'Cibertec - Lima',
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
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px] animate-fadeIn">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">
              Perfil del Usuario
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Rol:</strong> {usuario.rol}</p>
              <p><strong>Sede:</strong> {usuario.sede}</p>
            </div>

            <button
              onClick={() => setMostrarPerfil(false)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
