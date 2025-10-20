import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";
import type { Sede, NuevaReserva } from "../types/index";

type Props = {
  onClose: () => void;
  onCreated: () => void;
  sedes: Sede[];
};

export default function CrearReserva({ onClose, onCreated, sedes }: Props) {
  const [form, setForm] = useState<NuevaReserva>({
    nombre_cliente: "",
    cod_sede: 0,
    fecha: "",
    hora: "",
    cantidad_personas: 1,
    comentario: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      // ⏰ Formatear hora al formato HH:mm:ss
      const horaFormateada =
        form.hora && form.hora.length === 5 ? form.hora + ":00" : form.hora;

      // 🚀 Enviar todo el form al backend
      await api.reservas.create({
        nombre_cliente: form.nombre_cliente,
        cod_sede: Number(form.cod_sede),
        fecha: form.fecha,
        hora: horaFormateada,
        cantidad_personas: form.cantidad_personas,
        comentario: form.comentario,
      });

      onCreated();
      onClose();

      // Reset form
      setForm({
        nombre_cliente: "",
        cod_sede: 0,
        fecha: "",
        hora: "",
        cantidad_personas: 1,
        comentario: "",
      });
    } catch (err) {
      console.error("❌ Error al crear reserva:", err);
      alert("No se pudo crear la reserva.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Nueva Reserva</h3>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Nombre del cliente */}
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={form.nombre_cliente}
          onChange={(e) => handleChange("nombre_cliente", e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />

        {/* Selección de sede */}
        <select
          value={form.cod_sede}
          onChange={(e) => handleChange("cod_sede", Number(e.target.value))}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value={0}>Seleccione sede</option>
          {sedes.map((s) => (
            <option key={s.cod_sede} value={s.cod_sede}>
              {s.nombre_sede}
            </option>
          ))}
        </select>

        {/* Fecha */}
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />

        {/* Hora */}
        <input
          type="time"
          value={form.hora}
          onChange={(e) => handleChange("hora", e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />

        {/* Cantidad de personas */}
        <input
          type="number"
          min={1}
          value={form.cantidad_personas}
          onChange={(e) =>
            handleChange("cantidad_personas", Number(e.target.value))
          }
          className="border border-gray-300 p-2 rounded-lg"
          placeholder="Cantidad de personas"
        />

        {/* Comentario */}
        <textarea
          placeholder="Comentario (opcional)"
          value={form.comentario}
          onChange={(e) => handleChange("comentario", e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
        >
          Guardar Reserva
        </button>
      </div>
    </div>
  );
}
