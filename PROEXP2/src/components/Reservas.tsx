import { useState, useEffect } from 'react';
import { Calendar, PlusCircle, Users } from 'lucide-react';
import { api } from '../services/api';
import type { Reserva } from '../types/index';

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevaReserva, setNuevaReserva] = useState({
    cod_cliente: '',
    cod_sede: '',
    fecha: '',
    hora: '',
    cantidad_personas: 1,
    comentario: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [reservasData, sedesData] = await Promise.all([
          api.reservas.getAll(),
          api.sedes.getAll(),
        ]);
        setReservas(reservasData);
        setSedes(sedesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaReserva((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...nuevaReserva,
        cantidad_personas: Number(nuevaReserva.cantidad_personas),
      };

      const nueva = await api.reservas.create(dataToSend);
      setReservas((prev) => [...prev, nueva]);
      setNuevaReserva({
        cod_cliente: '',
        cod_sede: '',
        fecha: '',
        hora: '',
        cantidad_personas: 1,
        comentario: '',
      });
      alert('✅ Reserva creada correctamente');
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('❌ No se pudo crear la reserva');
    }
  };

  const getNombreSede = (id: string) =>
    sedes.find((s) => s.cod_sede === id)?.nombre_sede || '—';

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="p-8 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600 w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Reservas</h2>
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleCreateReserva}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-2xl shadow-md p-6 border border-gray-100"
      >
        <input
          type="text"
          name="cod_cliente"
          value={nuevaReserva.cod_cliente}
          onChange={handleChange}
          required
          placeholder="Nombre del cliente"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="cod_sede"
          value={nuevaReserva.cod_sede}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Seleccionar sede</option>
          {sedes.map((s) => (
            <option key={s.cod_sede} value={s.cod_sede}>
              {s.nombre_sede}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={nuevaReserva.fecha}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="time"
          name="hora"
          value={nuevaReserva.hora}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center gap-2">
          <Users className="text-blue-600" />
          <input
            type="number"
            name="cantidad_personas"
            value={nuevaReserva.cantidad_personas}
            onChange={handleChange}
            min="1"
            required
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          name="comentario"
          value={nuevaReserva.comentario}
          onChange={handleChange}
          placeholder="Comentario (opcional)"
          className="p-3 border rounded-lg col-span-2 focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-medium rounded-xl py-3 hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <PlusCircle size={20} /> Crear Reserva
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50 text-blue-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Sede</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Hora</th>
              <th className="px-6 py-3">Personas</th>
              <th className="px-6 py-3">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No hay reservas registradas
                </td>
              </tr>
            ) : (
              reservas.map((r) => (
                <tr
                  key={r.cod_reserva}
                  className="hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  <td className="px-6 py-3 text-gray-700">{r.cod_reserva}</td>
                  <td className="px-6 py-3">{r.cod_cliente}</td>
                  <td className="px-6 py-3">{getNombreSede(r.cod_sede)}</td>
                  <td className="px-6 py-3">{new Date(r.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{r.hora}</td>
                  <td className="px-6 py-3 text-center">{r.cantidad_personas}</td>
                  <td className="px-6 py-3">{r.comentario || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
