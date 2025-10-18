import { useState, useEffect } from "react";
import { ClipboardList, Calendar, User, Plus } from "lucide-react";
import axios from "axios";

type Pedido = {
  id: number;
  producto: string;
  cantidad: number;
  tamaño: string;
  bebida?: string;
  observaciones?: string;
  direccion: string;
  fecha: string;
  cod_sede: string;
  estado: string;
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
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  
  const [nuevoPedido, setNuevoPedido] = useState({
    producto: "",
    cantidad: 1,
    tamaño: "",
    bebida: "",
    observaciones: "",
    direccion: "",
    fecha: "",
    sede: "",
    estado: "Pendiente",
  });

  const [nuevaReserva, setNuevaReserva] = useState({
    sede: "",
    fecha: "",
    hora: "",
    personas: 1,
    observaciones: "",
  });

  const [stepReserva, setStepReserva] = useState(1);

  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    tipoUsuario: "Cliente",
    correo: "",
    contraseña: "",
  });

  // Cargar pedidos y reservas
  useEffect(() => {
    axios.get("http://localhost:3001/api/pedidos")
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:3001/api/reservas")
      .then(res => setReservas(res.data))
      .catch(err => console.error(err));
  }, []);

  const mapSedeAId = (sede: string) => {
    const mapping: Record<string, string> = {
      "Sede Larco": "S000001",
      "Sede Javier Prado": "S000002",
      "Sede Surco": "S000003",
      "Sede La Molina": "S000004",
      "Sede San Borja": "S000005",
    };
    return mapping[sede] || "";
  };

  const mapProductoAId = (producto: string) => {
    const mapping: Record<string, number> = {
      "Pollo a la brasa": 1,
      "Alitas": 2,
      "Papa frita": 3,
      "Ensalada": 4,
    };
    return mapping[producto] || 0;
  };

  const mapProductoAPrecio = (producto: string) => {
    const precios: Record<string, number> = {
      "Pollo a la brasa": 25,
      "Alitas": 15,
      "Papa frita": 10,
      "Ensalada": 12,
    };
    return precios[producto] || 0;
  };

  // --- Crear pedido ---
const handleCrearPedido = async () => {
  if (!nuevoPedido.producto || !nuevoPedido.cantidad || !nuevoPedido.tamaño || !nuevoPedido.sede || !nuevoPedido.direccion) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  const Nro_pedido = Date.now(); // ID temporal único

  const pedidoParaBD = {
    Nro_pedido,
    fecha_pedido: nuevoPedido.fecha || new Date().toISOString(),
    cod_cliente: "CL0001",
    cod_empleado: null,
    detalles: [
      {
        id_detalle_pedido: 1,
        Id_producto: mapProductoAId(nuevoPedido.producto),
        Cantidad: nuevoPedido.cantidad,
        Subtotal: nuevoPedido.cantidad * mapProductoAPrecio(nuevoPedido.producto),
      }
    ]
  };

  try {
    // No necesitamos 'res' si solo mostramos el alert
    await axios.post("http://localhost:3001/api/pedidos", pedidoParaBD);
    alert("✅ Pedido creado correctamente");

    const pedidosActualizados = await axios.get("http://localhost:3001/api/pedidos");
    setPedidos(pedidosActualizados.data);

    setNuevoPedido({
      producto: "",
      cantidad: 1,
      tamaño: "",
      bebida: "",
      observaciones: "",
      direccion: "",
      fecha: "",
      sede: "",
      estado: "Pendiente",
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    alert("❌ Error al crear el pedido");
  }
};

// --- Crear reserva ---
const handleCrearReserva = async () => {
  if (!nuevaReserva.sede || !nuevaReserva.fecha || !nuevaReserva.hora || nuevaReserva.personas < 1) {
    alert("Por favor completa todos los campos de la reserva");
    return;
  }

  // --- Wizard reservas ---
const nextStepReserva = () => {
  switch(stepReserva) {
    case 1:
      if (!nuevaReserva.sede) { alert("Selecciona una sede"); return; }
      break;
    case 2:
      if (!nuevaReserva.fecha) { alert("Selecciona una fecha"); return; }
      break;
    case 3:
      if (!nuevaReserva.hora || nuevaReserva.personas < 1) { alert("Selecciona hora y personas válidos"); return; }
      break;
  }
  if (stepReserva < 4) setStepReserva(stepReserva + 1);
};

const prevStepReserva = () => {
  if (stepReserva > 1) setStepReserva(stepReserva - 1);
};


  const reservaParaBD = {
    cod_cliente: "CL0001",
    cod_sede: mapSedeAId(nuevaReserva.sede),
    fecha: nuevaReserva.fecha,
    hora: nuevaReserva.hora,
    cantidad_personas: nuevaReserva.personas,
    comentario: nuevaReserva.observaciones || "",
  };

  try {
    await axios.post("http://localhost:3001/api/reservas", reservaParaBD);
    alert("✅ Reserva creada correctamente");

    const reservasActualizadas = await axios.get("http://localhost:3001/api/reservas");
    setReservas(reservasActualizadas.data);

    setNuevaReserva({ sede: "", fecha: "", hora: "", personas: 1, observaciones: "" });
    setStepReserva(1);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    alert("❌ Error al crear la reserva");
  }
};


  // --- Render ---
  return (
    <div className="space-y-10 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-red-700 mb-2">¡Bienvenido a Pardos Chicken! 🍗</h2>
        <button onClick={() => setMostrarPerfil(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          <User className="w-5 h-5"/> Perfil
        </button>
      </div>

      {/* Modal Perfil */}
      {mostrarPerfil && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">Perfil del Cliente</h2>
            {["nombre","apellido","telefono","correo","contraseña"].map(f => (
              <div key={f} className="mb-3">
                <label className="block text-sm font-medium">{f}</label>
                <input type={f==="contraseña"?"password":"text"} name={f} value={(perfil as any)[f]} onChange={(e)=>setPerfil({...perfil,[f]:e.target.value})} className="w-full border p-2 rounded-lg"/>
              </div>
            ))}
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setMostrarPerfil(false)} className="w-1/2 bg-gray-300 py-2 rounded-lg">Cerrar</button>
              <button onClick={()=>alert("Perfil actualizado ✅")} className="w-1/2 bg-blue-600 text-white py-2 rounded-lg">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Sección Pedidos */}
      {currentView==="pedidos" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
          <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2"><ClipboardList className="w-6 h-6"/> Nuevo Pedido</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Producto" value={nuevoPedido.producto} onChange={e=>setNuevoPedido({...nuevoPedido, producto:e.target.value})} className="border p-2 rounded-lg"/>
            <input type="number" min={1} placeholder="Cantidad" value={nuevoPedido.cantidad} onChange={e=>setNuevoPedido({...nuevoPedido, cantidad:Number(e.target.value)})} className="border p-2 rounded-lg"/>
            <select value={nuevoPedido.tamaño} onChange={e=>setNuevoPedido({...nuevoPedido, tamaño:e.target.value})} className="border p-2 rounded-lg">
              <option value="">Seleccionar tamaño</option>
              <option value="Personal">Personal</option>
              <option value="Mediano">Mediano</option>
              <option value="Familiar">Familiar</option>
            </select>
            <select value={nuevoPedido.bebida} onChange={e=>setNuevoPedido({...nuevoPedido, bebida:e.target.value})} className="border p-2 rounded-lg">
              <option value="">Seleccionar bebida</option>
              <option value="Inka Cola">Inka Cola</option>
              <option value="Coca Cola">Coca Cola</option>
              <option value="Agua">Agua</option>
            </select>
            <input placeholder="Dirección" value={nuevoPedido.direccion} onChange={e=>setNuevoPedido({...nuevoPedido, direccion:e.target.value})} className="border p-2 rounded-lg"/>
            <input type="date" value={nuevoPedido.fecha} onChange={e=>setNuevoPedido({...nuevoPedido, fecha:e.target.value})} className="border p-2 rounded-lg"/>
            <select value={nuevoPedido.sede} onChange={e=>setNuevoPedido({...nuevoPedido, sede:e.target.value})} className="border p-2 rounded-lg">
              <option value="">Seleccionar sede</option>
              <option value="Sede Larco">Sede Larco</option>
              <option value="Sede Javier Prado">Sede Javier Prado</option>
              <option value="Sede Surco">Sede Surco</option>
              <option value="Sede La Molina">Sede La Molina</option>
              <option value="Sede San Borja">Sede San Borja</option>
            </select>
            <textarea placeholder="Observaciones" value={nuevoPedido.observaciones} onChange={e=>setNuevoPedido({...nuevoPedido, observaciones:e.target.value})} className="border p-2 rounded-lg col-span-2"/>
          </div>
          <button onClick={handleCrearPedido} className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"><Plus className="w-5 h-5"/> Crear Pedido</button>

          <h3 className="text-xl font-semibold text-red-700 mt-6">Mis Pedidos</h3>
          {pedidos.length===0?<p>No tienes pedidos aún.</p>:(<div className="space-y-2">
            {pedidos.map(p=>(<div key={p.id} className="border p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.producto} ({p.tamaño})</p>
                <p className="text-sm">Cantidad: {p.cantidad}</p>
                {p.bebida && <p className="text-sm">Bebida: {p.bebida}</p>}
                {p.observaciones && <p className="text-sm">Obs: {p.observaciones}</p>}
                <p className="text-sm">Dir: {p.direccion}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${p.estado==="Pendiente"?"bg-gray-100 text-gray-600":p.estado==="En camino"?"bg-yellow-100 text-yellow-700":"bg-green-100 text-green-700"}`}>{p.estado}</span>
            </div>))}
          </div>)}
        </div>
      )}

      {/* Sección Reservas */}
      {currentView==="reservas" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
          <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2"><Calendar className="w-6 h-6"/> Crear Reserva</h3>

          {/* Wizard */}
          {stepReserva===1 && (
            <div>
              <label>Sede</label>
              <select value={nuevaReserva.sede} onChange={e=>setNuevaReserva({...nuevaReserva, sede:e.target.value})} className="border p-2 rounded-lg w-full">
                <option value="">Seleccionar sede</option>
                <option value="Sede Larco">Sede Larco</option>
                <option value="Sede Javier Prado">Sede Javier Prado</option>
                <option value="Sede Surco">Sede Surco</option>
                <option value="Sede La Molina">Sede La Molina</option>
                <option value="Sede San Borja">Sede San Borja</option>
              </select>
            </div>
          )}
          {stepReserva===2 && (
            <div>
              <label>Fecha</label>
              <input type="date" value={nuevaReserva.fecha} onChange={e=>setNuevaReserva({...nuevaReserva, fecha:e.target.value})} className="border p-2 rounded-lg w-full"/>
            </div>
          )}
          {stepReserva===3 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label>Hora</label>
                <input type="time" value={nuevaReserva.hora} onChange={e=>setNuevaReserva({...nuevaReserva, hora:e.target.value})} className="border p-2 rounded-lg w-full"/>
              </div>
              <div>
                <label>Personas</label>
                <input type="number" min={1} value={nuevaReserva.personas} onChange={e=>setNuevaReserva({...nuevaReserva, personas:Number(e.target.value)})} className="border p-2 rounded-lg w-full"/>
              </div>
            </div>
          )}
          {stepReserva===4 && (
            <div>
              <label>Observaciones</label>
              <textarea value={nuevaReserva.observaciones} onChange={e=>setNuevaReserva({...nuevaReserva, observaciones:e.target.value})} className="border p-2 rounded-lg w-full"/>
            </div>
          )}

          <div className="flex justify-between mt-4">
            {stepReserva>1 && <button onClick={prevStepReserva} className="px-4 py-2 bg-gray-300 rounded-lg">Atrás</button>}
            {stepReserva<4 && <button onClick={nextStepReserva} className="px-4 py-2 bg-red-600 text-white rounded-lg">Siguiente</button>}
            {stepReserva===4 && <button onClick={handleCrearReserva} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirmar Reserva</button>}
          </div>

          {/* Lista reservas */}
          <h3 className="text-xl font-semibold text-red-700 mt-6">Mis Reservas</h3>
          {reservas.length===0?<p>No tienes reservas aún.</p>:(<div className="space-y-2">
            {reservas.map(r=>(<div key={r.id} className="border p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{r.cod_sede}</p>
                <p className="text-sm">{r.fecha} — {r.hora}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-700">{r.cantidad_personas} personas</span>
            </div>))}
          </div>)}
        </div>
      )}
    </div>
  );
}
