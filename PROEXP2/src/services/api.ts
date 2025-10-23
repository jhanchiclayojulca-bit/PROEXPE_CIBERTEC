const API_BASE_URL = "http://localhost:3001/api";


function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}


async function get(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`,{
     headers: getAuthHeaders() ,
    });
  if (!response.ok) throw new Error("Error en la solicitud GET");
  return response.json();
}

async function post(endpoint: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la solicitud POST");
  return response.json();
}

async function put(endpoint: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la solicitud PUT");
  return response.json();
}

async function patch(endpoint: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la solicitud PATCH");
  return response.json();
}


async function del(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE" , headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error en la solicitud DELETE");
  return response.json();
}

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,

    // 🔹 AUTH
  auth: {
    login: (data: { email: string; password: string }) => 
      post("/auth/login", data),

    register: (data: {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
    rol?: "admin" | "cliente";   // ✅ ahora opcional
  }) => post("/auth/register", data),

    logout: (token: string) => 
      post("/auth/logout", { token }),
  },


  pedidos: {
    getAll: () => get("/pedidos"),
    getDetalle: (id: number) => get(`/pedidos/${id}/detalle`), // 👈 ahora recibe number
    create: (data: unknown) => post("/pedidos", data),
     delete: (id: number) => del(`/pedidos/${id}`), // 👈 agregado
  },
  
reservas: {
  getAll: () => api.get("/reservas"),
  create: (data: {
    nombre_cliente: string;
    cod_sede: number;
    fecha: string;
    hora: string;
    cantidad_personas: number;
    comentario?: string;
  }) => api.post("/reservas", data),
  delete: (id: number) => api.delete(`/reservas/${id}`), // 👈 aquí lo agregas
},


  productos: {
    // ✅ GET todos los productos
    getAll: () => get("/producto"),

    // ✅ POST nuevo producto
    create: (data: any) => post("/producto", data),

    // ✅ DELETE producto por ID
    delete: (id: number) => del(`/producto/${id}`),

    // ✅ PUT actualizar producto por ID
    update: (id: number, data: any) => put(`/producto/${id}`, data),
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
  getDetalle: (id: number) => get(`/facturas/${id}/detalle`),
  create: (data: any) => post("/facturas", data),
  delete: (id: number) => del(`/facturas/${id}`),  // 👈 este es el que te faltaba
},


  sedes: {
    getAll: () => get("/sedes"),
  },


reportes: {
  // Dashboard
  ventasDia: () => get("/reportes/ventas-dia"),
  pedidosActivos: () => get("/reportes/pedidos-activos"),
  facturasEmitidas: () => get("/reportes/facturas-emitidas"),
  reservasHoy: () => get("/reportes/reservas-hoy"),
  productosTop: () => get("/reportes/productos-top"),
  empleadosRendimiento: () => get("/reportes/empleados-rendimiento"),

  // Otros reportes adicionales
  ventasEmpleado: () => get("/reportes/ventas-empleado"),
  ingresosDiarios: () => get("/reportes/ingresos-diarios"),
},

usuarios: {
  getAll: () => api.get("/usuarios"),
  create: (data: any) => api.post("/usuarios", data),
  update: (id: number, data: any) => api.put(`/usuarios/${id}`, data),
  updateRol: (id: number, rol: string) => api.patch(`/usuarios/${id}/rol`, { rol }),
  delete: (id: number) => api.delete(`/usuarios/${id}`)
}




};