import { useState} from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import type { Factura } from '../types/index';

type Props = {
  onClose: () => void;
  onCreated: (factura: Factura) => void;
};

export default function CrearFactura({ onClose, onCreated }: Props) {
  const [nroPedido, setNroPedido] = useState('');
  const [detalles, setDetalles] = useState<
    Array<{ id_producto: string; Nombre_producto: string; Precio_unitario: number; Cantidad: number; Subtotal: number }>
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const cargarPedido = async () => {
    if (!nroPedido) return;
    try {
      // Trae el detalle del pedido desde tu API
      // Ahora
      const pedido: any = await api.pedidos.getDetalle(`${nroPedido}/detalle`);
      if (!pedido || !pedido.detalle) {
        alert('Pedido no encontrado o vacío');
        return;
      }

      const detallesPedido = pedido.detalle.map((d: any) => ({
        id_producto: d.id_producto,
        Nombre_producto: d.Nombre_producto || d.nombre_producto || '',
        Precio_unitario: d.Precio_unitario || d.precio,
        Cantidad: d.Cantidad,
        Subtotal: (d.Precio_unitario || d.precio) * d.Cantidad,
      }));

      setDetalles(detallesPedido);
    } catch (error) {
      console.error('Error al cargar pedido:', error);
      alert('Error al cargar el pedido');
    }
  };

  const total = detalles.reduce((sum, d) => sum + d.Subtotal, 0);
  const totalConIGV = total * 1.18;

  const handleCreate = async () => {
    if (detalles.length === 0) {
      alert('No hay productos para facturar');
      return;
    }

     const payload = {

      Fecha: new Date().toISOString(),
      Tipo: 'Factura',
      cod_empleado: 1, // Reemplaza con un código real de empleado
      detalle: detalles.map(d => ({
      Id_producto: d.id_producto,
      Cantidad: d.Cantidad,
      Subtotal: d.Subtotal,
    })),
};


    setSubmitting(true);
    try {
      const creado = await api.facturas.create(payload);
      if (creado) {
        onCreated(creado as Factura);
        onClose();
      } else {
        alert('Factura creada, pero respuesta inesperada del servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al crear factura.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Crear Factura desde Pedido</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingresar Nro de pedido */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Ingrese Nro. de pedido"
            value={nroPedido}
            onChange={(e) => setNroPedido(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg flex-1"
          />
          <button
            onClick={cargarPedido}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cargar Pedido
          </button>
        </div>

        {/* Mostrar detalle */}
        {detalles.length > 0 && (
          <div className="mb-4 space-y-2">
            {detalles.map((d, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center border border-gray-200 rounded-lg p-2">
                <div className="col-span-6">{d.Nombre_producto}</div>
                <div className="col-span-2">S/ {d.Precio_unitario.toFixed(2)}</div>
                <div className="col-span-2">{d.Cantidad}</div>
                <div className="col-span-2">S/ {d.Subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Totales */}
        {detalles.length > 0 && (
          <div className="text-right mt-4 space-y-1">
            <p className="text-gray-600">Subtotal: S/ {total.toFixed(2)}</p>
            <p className="text-gray-600">IGV (18%): S/ {(total * 0.18).toFixed(2)}</p>
            <p className="text-xl font-bold text-red-600">TOTAL: S/ {totalConIGV.toFixed(2)}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={submitting || detalles.length === 0}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow disabled:opacity-60"
          >
            {submitting ? 'Creando...' : 'Crear Factura'}
          </button>
        </div>
      </div>
    </div>
  );
}
