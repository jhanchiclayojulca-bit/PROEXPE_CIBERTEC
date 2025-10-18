export interface Producto {
  Id_producto: string;
  Nombre_producto: string;
  Categoria: string;
  Precio_unitario: number;
}

export interface Cliente {
  cod_cliente: string;
  tipo_documento: string;
  documento: string;
}

export interface Empleado {
  cod_empleado: string;
  dni: string;
  fecha_ingreso: string;
  nombre_cargo: string;
  nombre_completo: string;
  telefono: string;
  correo: string;
}

export interface Factura {
  Id_factura: string;
  Fecha: string;
  Hora: string;
  Tipo: string;
  cod_empleado: string;
  empleado?: string;
}

export interface DetalleFactura {
  Id_detalle_factura: string;
  Id_factura: string;
  Id_producto: string;
  Nombre_producto?: string;
  Precio_unitario?: number;
  Cantidad: number;
  Subtotal: number;
}

export interface Pedido {
  Nro_pedido: string;
  fecha_pedido: string;
  cod_cliente: string;
  cod_empleado: string;
  documento?: string;
  empleado?: string;
}

export interface DetallePedido {
  id_detalle_pedido: string;
  Nro_pedido: string;
  Id_producto: string;
  Nombre_producto?: string;
  Precio_unitario?: number;
  Cantidad: number;
  Subtotal: number;
}

export interface Reserva {
  cod_reserva: string;
  cod_cliente: string;
  cod_sede: string;
  cod_empleado: string;
  fecha: string;
  hora: string;
  cantidad_personas: number;
  comentario?: string;
  documento?: string;
  nombre_sede?: string;
  empleado?: string;
}

export interface Sede {
  cod_sede: string;
  nombre_sede: string;
  direccion: string;
  nombre_distrito: string;
}

export interface Reclamo {
  id_reclamo: string;
  tipo: string;
  detalle: string;
  fecha_registro: string;
  id_restaurante: string;
  cod_cliente: string;
  documento?: string;
  nombre_restaurante?: string;
}

export interface ReporteVentasEmpleado {
  cod_empleado: string;
  Empleado: string;
  Total_Ventas: number;
}

export interface ReporteProductoTop {
  Nombre_producto: string;
  Total_Cantidad: number;
  Total_Vendido: number;
}

export interface ReporteIngresosDiarios {
  Fecha: string;
  Facturas_Emitidas: number;
  Total_Diario: number;
}


