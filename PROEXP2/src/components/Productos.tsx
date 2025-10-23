import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Search, Trash2, Pencil } from "lucide-react";
import { api } from "../services/api";
import type { Producto } from "../types/index";
import CrearProducto from "./CrearProducto";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrear, setShowCrear] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null); // 👈 para editar
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await api.productos.getAll();
      setProductos(data);
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductoCreado = (nuevo: Producto) => {
    setProductos((prev) => [...prev, nuevo]);
  };

  const handleProductoEditado = (editado: Producto) => {
    setProductos((prev) =>
      prev.map((p) => (p.Id_producto === editado.Id_producto ? editado : p))
    );
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.productos.delete(id);
      setProductos((prev) => prev.filter((p) => p.Id_producto !== id));
      alert("✅ Producto eliminado correctamente");
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
      alert("Error al eliminar producto");
    }
  };

  // 🔎 Filtrado por nombre o categoría
  const filteredProductos = productos.filter((p) =>
    p.Nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        </div>
        <button
          onClick={() => setShowCrear(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* 🔎 Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar productos por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* 🛒 Tarjetas de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProductos.map((p) => (
          <div
            key={p.Id_producto}
            className="flex flex-col justify-between p-6 bg-white border-l-4 border-red-500 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{p.Nombre_producto}</h3>
              <ShoppingBag className="w-6 h-6 text-red-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500">{p.Categoria}</p>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Código</p>
              <p className="text-base font-medium text-gray-800">{p.Id_producto}</p>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">Precio</p>
              <p className="text-2xl font-bold text-red-600">
                S/ {Number(p.Precio_unitario).toFixed(2)}
              </p>
            </div>

            {/* Botones acciones */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditingProducto(p)}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(p.Id_producto)}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredProductos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      )}

      {/* Modal Crear Producto */}
      {showCrear && (
        <CrearProducto
          onClose={() => setShowCrear(false)}
          onCreated={handleProductoCreado}
        />
      )}

      {/* Modal Editar Producto */}
      {editingProducto && (
        <CrearProducto
          producto={editingProducto}   // 👈 pasamos el producto a editar
          onClose={() => setEditingProducto(null)}
          onCreated={handleProductoEditado} // lo reutilizamos
        />
      )}
    </div>
  );
}
