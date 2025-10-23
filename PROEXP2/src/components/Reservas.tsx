import { useEffect, useState } from "react";
import { Calendar, PlusCircle, Users, Clock, Search, Trash2 } from "lucide-react";
import { api } from "../services/api";
import type { Reserva, Sede } from "../types/index";
import CrearReserva from "./CrearReserva";

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

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
        <div className="animate-spin h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <p className="text-red-600 text-center font-medium p-4">{error}</p>;

  const reservasFiltradas = reservas.filter((r) =>
    (r.nombre_cliente || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Eliminar reserva
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      await api.reservas.delete(id);
      setReservas((prev) => prev.filter((res) => res.cod_reserva !== id));
    } catch (err) {
      console.error("❌ Error eliminando reserva:", err);
      alert("Error al eliminar reserva");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="text-red-600 w-7 h-7" />
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
      </div>

      {/* 🔎 Buscador y Botón */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre del cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl shadow hover:bg-red-700 transition"
        >
          <PlusCircle className="w-5 h-5" /> Nueva Reserva
        </button>
      </div>

      {/* Lista de reservas */}
      {reservasFiltradas.length === 0 ? (
        <p className="text-gray-600 text-center">No se encontraron reservas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservasFiltradas.map((r) => {
            const fechaFormatted = r.fecha
              ? new Date(r.fecha).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "—";

            let horaFormatted = "—";
            if (r.hora) {
              try {
                const horaDate = new Date(r.hora);
                horaFormatted = horaDate.toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              } catch {
                horaFormatted = r.hora.substring(0, 5);
              }
            }

            return (
              <div
                key={r.cod_reserva}
                className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl border-t-4 border-red-500 transition transform hover:-translate-y-1 p-5 flex flex-col gap-3"
              >
                {/* Cliente y Sede */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {r.nombre_cliente || "Cliente desconocido"}
                    </h3>
                    <p className="text-xs text-gray-500"># {r.cod_reserva}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {r.nombre_sede || "—"}
                  </span>
                </div>

                {/* Fecha y Hora */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>{fechaFormatted}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{horaFormatted}</span>
                  </div>
                </div>

                {/* Personas */}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {r.cantidad_personas} personas
                  </span>
                </div>

                {/* Comentario */}
                <p className="text-gray-600 text-sm italic border-t pt-2">
                  {r.comentario || "Sin comentario"}
                </p>

                {/* Botón eliminar */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleEliminar(r.cod_reserva)}
                    className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear Reserva */}
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
