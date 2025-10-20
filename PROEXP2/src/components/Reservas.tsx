import { useEffect, useState } from "react";
import { Calendar, PlusCircle } from "lucide-react";
import { api } from "../services/api";
import type { Reserva, Sede } from "../types/index";
import CrearReserva from "./CrearReserva"; // 👈 importamos el modal

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // cargar reservas y sedes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservasData = await api.reservas.getAll();
        setReservas(reservasData);

        const sedesData = await api.sedes.getAll();
        setSedes(sedesData);
      } catch (err) {
        console.error("❌ Error al cargar datos en frontend:", err);
        setError("No se pudieron cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <p className="text-red-600 text-center font-medium p-4">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600 w-7 h-7" />
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" /> Nueva Reserva
        </button>
      </div>

      {reservas.length === 0 ? (
        <p className="text-gray-600 text-center">No hay reservas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-50 text-blue-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">Código</th>
                <th className="px-6 py-3 border-b">Cliente</th>
                <th className="px-6 py-3 border-b">Sede</th>
                <th className="px-6 py-3 border-b">Fecha</th>
                <th className="px-6 py-3 border-b">Hora</th>
                <th className="px-6 py-3 border-b text-center">Personas</th>
                <th className="px-6 py-3 border-b">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.cod_reserva} className="hover:bg-gray-50 border-t">
                  <td className="px-6 py-3 text-gray-800">{r.cod_reserva}</td>
                  <td className="px-6 py-3">{r.nombre_cliente || "—"}</td>
                  <td className="px-6 py-3">{r.nombre_sede || "—"}</td>
                  <td className="px-6 py-3">{new Date(r.fecha).toLocaleDateString("es-PE")}</td>
                  <td className="px-6 py-3">{r.hora}</td>
                  <td className="px-6 py-3 text-center">{r.cantidad_personas}</td>
                  <td className="px-6 py-3">{r.comentario || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <CrearReserva
            onClose={() => setShowModal(false)}
            onCreated={async () => {
              const updated = await api.reservas.getAll();
              setReservas(updated);
            }}
            sedes={sedes}
          />
        </div>
      )}
    </div>
  );
}
