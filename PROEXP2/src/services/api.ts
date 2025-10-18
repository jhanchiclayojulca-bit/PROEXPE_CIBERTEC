const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Error en la solicitud');
    return response.json();
  },

  async post(endpoint: string, data: unknown) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error en la solicitud');
    return response.json();
  },

  async put(endpoint: string, data: unknown) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error en la solicitud');
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error en la solicitud');
    return response.json();
  },

  productos: {
    getAll: () => api.get('/productos'),
  },

  clientes: {
    getAll: () => api.get('/clientes'),
  },

  empleados: {
    getAll: () => api.get('/empleados'),
    getById: (id: string) => api.get(`/empleado/${id}`),
  },

  facturas: {
    getAll: () => api.get('/facturas'),
    getByFecha: (fecha: string) => api.get(`/facturas/fecha/${fecha}`),
    getDetalle: (id: string) => api.get(`/factura/${id}/detalle`),
    create: (data: unknown) => api.post('/facturas', data),
  },

  pedidos: {
    getAll: () => api.get('/pedidos'),
    getDetalle: (id: string) => api.get(`/pedido/${id}/detalle`),
    create: (data: unknown) => api.post('/pedidos', data),
  },

  reservas: {
    getAll: () => api.get('/reservas'),
    getById: (id: string) => api.get(`/reservas/${id}`), // 👈 para obtener una reserva específica
    create: (data: unknown) => api.post('/reservas', data), // 👈 crear nueva reserva
    update: (id: string, data: unknown) => api.put(`/reservas/${id}`, data), // 👈 opcional
    delete: (id: string) => api.delete(`/reservas/${id}`), // 👈 opcional
  },

  sedes: {
    getAll: () => api.get('/sedes'),
  },

  reportes: {
    ventasEmpleado: () => api.get('/reportes/ventas-empleado'),
    productosTop: () => api.get('/reportes/productos-top'),
    ingresosDiarios: () => api.get('/reportes/ingresos-diarios'),
  },

  reclamos: {
    getAll: () => api.get('/reclamos'),
  },
};
