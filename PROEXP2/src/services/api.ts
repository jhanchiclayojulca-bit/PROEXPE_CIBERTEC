const API_BASE_URL = "http://localhost:3001/api";

async function get(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error("Error en la solicitud GET");
  return response.json();
}

async function post(endpoint: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la solicitud POST");
  return response.json();
}

async function put(endpoint: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la solicitud PUT");
  return response.json();
}

async function del(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error en la solicitud DELETE");
  return response.json();
}

export const api = {
  get,
  post,
  put,
  delete: del,

  pedidos: {
    getAll: () => get("/pedidos"),
    getDetalle: (id: number) => get(`/pedidos/${id}/detalle`), // 👈 ahora recibe number
    create: (data: unknown) => post("/pedidos", data),
  },
  
reservas: {
  // ✅ Crear reserva con nombre_cliente (el backend crea cliente + reserva)
  create: (data: {
    nombre_cliente: string;
    cod_sede: number;
    fecha: string;
    hora: string;
    cantidad_personas: number;
    comentario?: string;
  }) => post("/reservas", data),

  // ✅ Obtener todas
  getAll: () => get("/reservas"),
},


  reportes: {
    ventasEmpleado: () => get("/reportes/ventas-empleado"),
    productosTop: () => get("/reportes/productos-top"),
    ingresosDiarios: () => get("/reportes/ingresos-diarios"),
  },

  productos: {
    getAll: () => get("/productos"),
  },

  clientes: {
    // ✅ Crear cliente nuevo
    create: (data: { nombre_cliente: string }) => post("/clientes", data),
    getAll: () => get("/clientes"),
  },


  empleados: {
    getAll: () => get("/empleados"),
    getById: (id: string) => get(`/empleado/${id}`),
  },

  facturas: {
  getAll: () => get("/facturas"),
  getDetalle: (id: number) => api.get(`/facturas/${id}/detalle`),
  create: (data: any) => api.post("/facturas", data),
},

  sedes: {
    getAll: () => get("/sedes"),
  },
};