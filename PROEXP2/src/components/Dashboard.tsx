import { useState, useEffect } from "react";
import { ShoppingBag, FileText, Calendar, TrendingUp, Users, DollarSign } from "lucide-react";
import { api } from "../services/api";

export default function Dashboard() {
  const [ventasDia, setVentasDia] = useState(0);
  const [pedidosActivos, setPedidosActivos] = useState(0);
  const [facturasEmitidas, setFacturasEmitidas] = useState(0);
  const [reservasHoy, setReservasHoy] = useState(0);
  const [productosTop, setProductosTop] = useState<any[]>([]);
  const [empleadosRendimiento, setEmpleadosRendimiento] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const vd = await api.reportes.ventasDia();
        const pa = await api.reportes.pedidosActivos();
        const fe = await api.reportes.facturasEmitidas();
        const rh = await api.reportes.reservasHoy();
        const pt = await api.reportes.productosTop();
        const er = await api.reportes.empleadosRendimiento();

        setVentasDia(vd?.VentasDia ?? 0);
        setPedidosActivos(pa?.PedidosActivos ?? 0);
        setFacturasEmitidas(fe?.FacturasEmitidas ?? 0);
        setReservasHoy(rh?.ReservasHoy ?? 0);
        setProductosTop(pt ?? []);
        setEmpleadosRendimiento(er ?? []);
      } catch (err) {
        console.error("❌ Error cargando dashboard:", err);
      }
    };
    loadData();
  }, []);

  const stats = [
    {
      title: "Ventas del Día",
      value: `S/ ${ventasDia.toFixed(2)}`,
      icon: DollarSign,
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Pedidos Activos",
      value: pedidosActivos,
      icon: ShoppingBag,
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Facturas Emitidas",
      value: facturasEmitidas,
      icon: FileText,
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Reservas Hoy",
      value: reservasHoy,
      icon: Calendar,
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Resumen general del sistema de ventas</p>
      </div>

      {/* 📊 Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-red-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 Productos más vendidos y rendimiento empleados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Productos Más Vendidos</h3>
          </div>
          <div className="space-y-4">
            {productosTop.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{p.Nombre_producto}</span>
                  <span className="text-sm text-gray-500">{p.TotalVendidos} unidades</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, p.TotalVendidos)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rendimiento de empleados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Rendimiento de Empleados</h3>
          </div>
          <div className="space-y-4">
            {empleadosRendimiento.map((e, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{e.Empleado}</p>
                  <p className="text-sm text-gray-500">{e.TotalPedidos} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">S/ {e.TotalVentas.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
