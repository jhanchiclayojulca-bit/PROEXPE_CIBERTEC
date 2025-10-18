import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import type { Reserva } from '../types/index';

type Props = {
  onClose: () => void;
  onCreated: (reserva: Reserva) => void;
};

export default function CrearReserva({ onClose, onCreated }: Props) {
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState('12:00');
  const [personas, setPersonas] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!cliente || !fecha || !hora || personas <= 0) {
      alert('Complete todos los campos correctamente');
      return;
    }

    const payload = {
      cliente,
      fecha,
      hora,
      personas,
    };

    setSubmitting(true);
    try {
      const creado = await api.reservas.create(payload);
      if (creado) {
        onCreated(creado as Reserva);
        onClose();
      } else {
        alert('Reserva creada, pero respuesta inesperada del servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al crear reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Nueva Reserva</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Cantidad de personas"
            value={personas}
            min={1}
            onChange={(e) => setPersonas(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded-lg w-full"
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
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow disabled:opacity-60"
          >
            {submitting ? 'Creando...' : 'Crear Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}
