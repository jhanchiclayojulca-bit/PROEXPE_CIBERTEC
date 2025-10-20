import { useState, useEffect } from 'react';
import type { Pedido } from '../types/index';
import { api } from '../services/api';
import { X, PlusCircle } from 'lucide-react';

type Props = {
  onClose: () => void;
  onCreated: (pedido: Pedido) => void;
};

type Producto = {
  id_producto: number;
  nombre_producto: string;
  precio: number | null; // 👈 puede venir null de la BD
};


type Empleado = {
  id: string;   // cod_empleado (E00001, etc.)
  nombre: string;
};

export default function CrearPedido({ onClose, onCreated }: Props) {
  const [fecha_pedido, setFechaPedido] = useState(new Date().toISOString().slice(0, 10));
  const [clienteNombre, setClienteNombre] = useState('');
  const [empleado, setEmpleado] = useState('');   // aquí guardamos el cod_empleado (E00001)
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [detalles, setDetalles] = useState<
  Array<{ id_producto: number | null; Precio_unitario: number | null; Cantidad: number }>
>([{ id_producto: null, Precio_unitario: null, Cantidad: 1 }]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProductos();
    loadEmpleados();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await api.productos.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const loadEmpleados = async () => {
    try {
      const data = await api.empleados.getAll();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

 const setDetalleField = (i: number, field: string, value: string | number) => {
  setDetalles((prev) => {
    const copy = [...prev];
    // @ts-ignore
    copy[i][field] = value;

         if (field === 'id_producto') {
           const prod = productos.find((p) => p.id_producto === Number(value));
           copy[i].Precio_unitario = prod?.precio ?? null;
         }


          return copy;
        });
      };


  const addRow = () =>
    setDetalles((prev) => [...prev, { id_producto: null, Precio_unitario: 0, Cantidad: 1 }]);

  const removeRow = (i: number) => setDetalles((prev) => prev.filter((_, idx) => idx !== i));

  const handleCreate = async () => {
  if (!empleado) {
    alert('Seleccione un empleado');
    return;
  }

  if (!clienteNombre.trim()) {
    alert('Ingrese el nombre del cliente');
    return;
  }

const detalleValido = detalles.filter((d) => d.id_producto && d.Cantidad > 0);
  if (detalleValido.length === 0) {
    alert('Agregue al menos un producto válido');
    return;
  }

  try {
    setSubmitting(true);

    // 1️⃣ Crear cliente en la BD (devuelve el cod_cliente autogenerado)
    const nuevoCliente = await api.clientes.create({ nombre_cliente: clienteNombre });
    const codCliente = nuevoCliente.cod_cliente;

    // 2️⃣ Crear pedido con ese cod_cliente
    const payload = {
      fecha_pedido,
      cod_cliente: codCliente,
      cod_empleado: empleado,
      detalles: detalleValido.map((d) => ({
        Id_producto: d.id_producto,
        Cantidad: d.Cantidad,
        Subtotal: (d.Precio_unitario ?? 0) * d.Cantidad,
      })),
    };

    const creado = await api.pedidos.create(payload);

    if (creado) {
      onCreated(creado as Pedido);
      onClose();
    } else {
      alert('Pedido creado, pero respuesta inesperada del servidor.');
    }
  } catch (err) {
    console.error('❌ Error al crear pedido:', err);
    alert('Error al crear pedido.');
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Nuevo Pedido</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-lg"
            value={fecha_pedido}
            onChange={(e) => setFechaPedido(e.target.value)}
          />

          {/* ✅ Campo para el nombre del cliente */}
          <input
            className="border border-gray-300 p-2 rounded-lg"
            placeholder="Nombre y Apellido del Cliente"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />


          {/* Select de empleado (value = cod_empleado) */}
          <select
            className="border border-gray-300 p-2 rounded-lg"
            value={empleado}
            onChange={(e) => setEmpleado(e.target.value)}
          >
            <option value="">Seleccione empleado</option>
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre} {/* 👈 Se muestra el nombre */}
              </option>
            ))}
          </select>

        </div>

        {/* Detalle del pedido */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Detalle del Pedido</h4>
          <div className="space-y-2">
            {detalles.map((d, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 items-center border border-gray-200 rounded-lg p-2"
              >
                {/* Producto */}
                <select
                  className="col-span-5 border border-gray-300 p-2 rounded-lg"
                  value={d.id_producto ?? ""}
                  onChange={(e) => setDetalleField(i, 'id_producto', Number(e.target.value))}
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre_producto} — S/ {(p.precio ?? 0).toFixed(2)}
                    </option>
                  ))}

                </select>



                {/* Precio automático */}
                <input
                  type="number"
                  className="col-span-3 border border-gray-300 p-2 rounded-lg bg-gray-100"
                  placeholder="Precio"
                  value={d.Precio_unitario !== null ? String(d.Precio_unitario) : ""}
                  readOnly
                />


                {/* Cantidad */}
                <input
                  type="number"
                  className="col-span-2 border border-gray-300 p-2 rounded-lg"
                  placeholder="Cant."
                  value={String(d.Cantidad)}
                  onChange={(e) => setDetalleField(i, 'Cantidad', Number(e.target.value))}
                />

                {/* Eliminar fila */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => removeRow(i)}
                    type="button"
                    className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addRow}
              type="button"
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mt-2"
            >
              <PlusCircle className="w-4 h-4" /> Agregar producto
            </button>
          </div>
        </div>

        {/* Botones */}
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
            {submitting ? 'Creando...' : 'Crear Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
