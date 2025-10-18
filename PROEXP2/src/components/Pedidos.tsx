import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Eye, X } from 'lucide-react';
import { api } from '../services/api';
import type { Pedido, DetallePedido } from '../types/index';
import CrearPedido from './CrearPedido';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<DetallePedido[]>([]);
  const [showCrear, setShowCrear] = useState(false);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await api.pedidos.getAll();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (nroPedido: string) => {
    try {
      const data = await api.pedidos.getDetalle(nroPedido);
      setDetalle(data);
      setSelectedPedido(nroPedido);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  };

  const handlePedidoCreado = (nuevoPedido: Pedido) => {
    setPedidos((prev) => [...prev, nuevoPedido]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
        </div>
        <button
          onClick={() => setShowCrear(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nro. Pedido', 'Fecha', 'Cliente', 'Empleado', 'Acciones'].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pedidos.map((pedido) => (
                <tr key={pedido.Nro_pedido} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pedido.Nro_pedido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pedido.fecha_pedido).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pedido.documento}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pedido.empleado}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => verDetalle(pedido.Nro_pedido)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle del pedido */}
      {selectedPedido && detalle.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Detalle del Pedido: {selectedPedido}
            </h3>
            <button
              onClick={() => setSelectedPedido(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Producto', 'Precio Unit.', 'Cantidad', 'Subtotal'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {detalle.map((item) => (
                  <tr key={item.id_detalle_pedido}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.Nombre_producto}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      S/ {item.Precio_unitario?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.Cantidad}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      S/ {item.Subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={3} className="px-4 py-3 text-right text-gray-700">
                    TOTAL:
                  </td>
                  <td className="px-4 py-3 text-red-600">
                    S/ {detalle.reduce((sum, item) => sum + item.Subtotal, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Crear Pedido */}
      {showCrear && (
        <CrearPedido
          onClose={() => setShowCrear(false)}
          onCreated={handlePedidoCreado}
        />
      )}
    </div>
  );
}
