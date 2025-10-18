import { useState, useEffect } from 'react';
import Auth from './components/login';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  FileText,
  Calendar,
  Menu,
  X,
  ChefHat
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import Pedidos from './components/Pedidos';
import Facturas from './components/Facturas';
import Reservas from './components/Reservas';
import ClientPanel from './components/ClientPanel'; // 👈 Nuevo panel de cliente

type View = 'dashboard' | 'productos' | 'pedidos' | 'facturas' | 'reservas';
type Role = 'admin' | 'cliente' | null;

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role') as Role;
    if (token && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, []);

  const handleLogin = (userRole: 'admin' | 'cliente') => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('role', userRole);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  // Menú según rol
  const menuItems =
    role === 'admin'
      ? [
          { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'productos' as View, label: 'Productos', icon: ShoppingBag },
          { id: 'pedidos' as View, label: 'Pedidos', icon: ClipboardList },
          { id: 'facturas' as View, label: 'Facturas', icon: FileText },
          { id: 'reservas' as View, label: 'Reservas', icon: Calendar },
        ]
      : [
          { id: 'dashboard' as View, label: 'Mi Panel', icon: LayoutDashboard },
          { id: 'pedidos' as View, label: 'Mis Pedidos', icon: ClipboardList },
          { id: 'reservas' as View, label: 'Mis Reservas', icon: Calendar },
        ];

  // Render según rol
  const renderView = () => {
    if (role === 'cliente') {
      return <ClientPanel currentView={currentView} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <Productos />;
      case 'pedidos':
        return <Pedidos />;
      case 'facturas':
        return <Facturas />;
      case 'reservas':
        return <Reservas />;
      default:
        return <Dashboard />;
    }
  };

  // Si no está logueado
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-red-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <ChefHat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Pardos Chicken</h1>
              <p className="text-sm text-red-100">Sistema de Ventas</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-red-100">Usuario</p>
              <p className="font-semibold">{role === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 text-sm bg-white/10 px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="flex">
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:static
            inset-y-0 left-0
            z-40
            w-64
            bg-white
            shadow-lg
            transition-transform duration-300 ease-in-out
            mt-[73px] lg:mt-0
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive ? 'bg-red-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderView()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
