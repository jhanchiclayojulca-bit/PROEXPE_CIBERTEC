import { useState, useEffect } from "react";
import { ClipboardList, Calendar, User, Plus, Eye, Trash2, X } from "lucide-react";
import axios from "axios";

type Producto = {
  Id_producto: number;
  Nombre_producto: string;
  Precio_unitario: number;
};

type Pedido = {
  id_pedido: number;
  fecha_pedido: string;
  direccion?: string;
};

type DetallePedido = {
  Id_producto: number;
  Nombre_producto: string;
  Cantidad: number;
  Precio_unitario: number;
  Subtotal: number;
};

type Reserva = {
  id: number;
  cod_sede: string;
  fecha: string;
  hora: string;
  cantidad_personas: number;
  comentario?: string;
};

export default function ClientPanel({ currentView }: { currentView: string }) {
  // Estados principales
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detalle, setDetalle] = useState<DetallePedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<number | null>(null);

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [stepReserva, setStepReserva] = useState(1);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  // Formularios
  const [nuevoPedido, setNuevoPedido] = useState({
    producto: "",
    cantidad: 1,
    direccion: "",
    fecha: "",
  });

  const [nuevaReserva, setNuevaReserva] = useState({
    sede: "",
    fecha: "",
    hora: "",
    personas: 1,
    observaciones: "",
  });

  const [perfil, setPerfil] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "999999999",
    tipoUsuario: "Cliente",
    correo: "juanperez@gmail.com",
    contraseña: "******",
  });

  // --- Cargar datos ---
  useEffect(() => {
    loadPedidos();
    loadReservas();
    loadProductos();
  }, []);

  const loadPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/pedidos");
      setPedidos(res.data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    }
  };

  const loadReservas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/reservas");
      setReservas(res.data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    }
  };

  const loadProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  // --- Crear Pedido ---
  const handleCrearPedido = async () => {
    if (!nuevoPedido.producto || !nuevoPedido.direccion) {
      alert("⚠️ Completa los campos obligatorios");
      return;
    }

    const productoSel = productos.find((p) => p.Id_producto === Number(nuevoPedido.producto));
    if (!productoSel) return;

    const pedidoParaBD = {
      fecha_pedido: nuevoPedido.fecha || new Date().toISOString(),
      cod_cliente: 1, // 👈 debería venir del login real
      cod_empleado: 1, // 👈 por ahora fijo
      detalles: [
        {
          Id_producto: productoSel.Id_producto,
          Cantidad: nuevoPedido.cantidad,
          Subtotal: nuevoPedido.cantidad * productoSel.Precio_unitario,
        },
      ],
    };

    try {
      await axios.post("http://localhost:3001/api/pedidos", pedidoParaBD);
      alert("✅ Pedido creado correctamente");
      loadPedidos();
      setNuevoPedido({ producto: "", cantidad: 1, direccion: "", fecha: "" });
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("❌ Error al crear el pedido");
    }
  };

  // --- Ver detalle ---
  const verDetalle = async (id: number) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/pedidos/${id}/detalle`);
      setDetalle(res.data);
      setSelectedPedido(id);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
    }
  };

  // --- Eliminar pedido ---
  const eliminarPedido = async (id: number) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/pedidos/${id}`);
      alert("✅ Pedido eliminado");
      loadPedidos();
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
    }
  };

  // --- Crear Reserva ---
  const reservaParaBD = {
    cod_cliente: 1,
    cod_sede: nuevaReserva.sede,
    fecha: nuevaReserva.fecha,
    hora: nuevaReserva.hora,
    cantidad_personas: nuevaReserva.personas,
    comentario: nuevaReserva.observaciones || "",
  };

  const handleCrearReserva = async () => {
    if (!nuevaReserva.sede || !nuevaReserva.fecha || !nuevaReserva.hora || nuevaReserva.personas < 1) {
      alert("⚠️ Completa todos los campos de la reserva");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/reservas", reservaParaBD);
      alert("✅ Reserva creada correctamente");
      loadReservas();
      setNuevaReserva({ sede: "", fecha: "", hora: "", personas: 1, observaciones: "" });
      setStepReserva(1);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("❌ Error al crear la reserva");
    }
  };

  // --- Wizard reserva ---
  const nextStepReserva = () => {
    switch (stepReserva) {
      case 1:
        if (!nuevaReserva.sede) return alert("Selecciona una sede");
        break;
      case 2:
        if (!nuevaReserva.fecha) return alert("Selecciona una fecha");
        break;
      case 3:
        if (!nuevaReserva.hora || nuevaReserva.personas < 1) return alert("Completa hora y personas");
        break;
    }
    if (stepReserva < 4) setStepReserva(stepReserva + 1);
  };

  const prevStepReserva = () => stepReserva > 1 && setStepReserva(stepReserva - 1);

  // --- Render ---
  return (
    <div className="space-y-10 p-6">
      {/* Vista Pedidos */}
      {currentView === "pedidos" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
          <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            <ClipboardList className="w-6 h-6" /> Nuevo Pedido
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Selección de producto */}
            <select
              value={nuevoPedido.producto}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, producto: e.target.value })}
              className="border p-2 rounded-lg"
            >
              <option value="">Seleccionar producto</option>
              {productos.map((prod) => (
                <option key={prod.Id_producto} value={prod.Id_producto}>
                  {prod.Nombre_producto} - S/ {prod.Precio_unitario.toFixed(2)}
                </option>
              ))}
            </select>

            {/* Cantidad */}
            <input
              type="number"
              min={1}
              placeholder="Cantidad"
              value={nuevoPedido.cantidad}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, cantidad: Number(e.target.value) })}
              className="border p-2 rounded-lg"
            />

            {/* Dirección */}
            <input
              placeholder="Dirección"
              value={nuevoPedido.direccion}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, direccion: e.target.value })}
              className="border p-2 rounded-lg col-span-2"
            />

            {/* Fecha */}
            <input
              type="date"
              value={nuevoPedido.fecha}
              onChange={(e) => setNuevoPedido({ ...nuevoPedido, fecha: e.target.value })}
              className="border p-2 rounded-lg"
            />
          </div>

          <button onClick={handleCrearPedido} className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Plus className="w-5 h-5" /> Crear Pedido
          </button>

          <h3 className="text-xl font-semibold text-red-700 mt-6">Mis Pedidos</h3>
          {pedidos.length === 0 ? (
            <p>No tienes pedidos aún.</p>
          ) : (
            <div className="space-y-2">
              {pedidos.map((p) => (
                <div key={p.id_pedido} className="border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Pedido #{p.id_pedido}</p>
                    <p className="text-sm">Fecha: {new Date(p.fecha_pedido).toLocaleDateString()}</p>
                    <p className="text-sm">Dir: {p.direccion}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => verDetalle(p.id_pedido)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                      <Eye className="w-4 h-4" /> Detalle
                    </button>
                    <button onClick={() => eliminarPedido(p.id_pedido)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal detalle */}
          {selectedPedido && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-red-600">Detalle Pedido #{selectedPedido}</h3>
                  <button onClick={() => setSelectedPedido(null)}>
                    <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <table className="min-w-full text-sm divide-y divide-gray-200 border rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-left">Precio</th>
                      <th className="px-4 py-2 text-left">Cantidad</th>
                      <th className="px-4 py-2 text-left">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.map((d) => (
                      <tr key={d.Id_producto}>
                        <td className="px-4 py-2">{d.Nombre_producto}</td>
                        <td className="px-4 py-2">S/ {d.Precio_unitario.toFixed(2)}</td>
                        <td className="px-4 py-2">{d.Cantidad}</td>
                        <td className="px-4 py-2 font-semibold">S/ {d.Subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista Reservas (igual que la tuya, con wizard) */}
      {currentView === "reservas" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
          <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            <Calendar className="w-6 h-6" /> Crear Reserva
          </h3>
          {/* Wizard aquí */}
        </div>
      )}
    </div>
  );
}
