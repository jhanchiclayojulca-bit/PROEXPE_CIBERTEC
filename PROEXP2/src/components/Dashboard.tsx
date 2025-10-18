import { ShoppingBag, FileText, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Ventas del Día',
      value: 'S/ 1,250.00',
      icon: DollarSign,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pedidos Activos',
      value: '24',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Facturas Emitidas',
      value: '18',
      icon: FileText,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Reservas Hoy',
      value: '12',
      icon: Calendar,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Resumen general del sistema de ventas</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Productos Más Vendidos</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Pollo a la brasa', sold: 45, percentage: 85 },
              { name: 'Inka Cola 1L', sold: 38, percentage: 72 },
              { name: 'Papas fritas', sold: 32, percentage: 60 },
            ].map((product) => (
              <div key={product.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                  <span className="text-sm text-gray-500">{product.sold} unidades</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Rendimiento de Empleados</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Juan Pérez', sales: 'S/ 2,450.00', orders: 15 },
              { name: 'María López', sales: 'S/ 1,980.00', orders: 12 },
              { name: 'Luis Ramírez', sales: 'S/ 1,750.00', orders: 10 },
            ].map((employee) => (
              <div
                key={employee.name}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.orders} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{employee.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
