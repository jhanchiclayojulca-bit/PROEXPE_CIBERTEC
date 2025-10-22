import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../services/api";
import type { Producto } from "../types/index";

type Props = {
  onClose: () => void;
  onCreated: (producto: Producto) => void;
};

export default function CrearProducto({ onClose, onCreated }: Props) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!nombre || !categoria || !precio) {
    alert("Todos los campos son obligatorios");
    return;
  }

  setSubmitting(true);
  try {
    const nuevoProducto = {
      Nombre_producto: nombre,
      Categoria: categoria,
      Precio_unitario: parseFloat(precio),
    };

    // ✅ usa la ruta correcta
    const created: Producto = await api.post("/producto", nuevoProducto);

    // 👌 añade el producto devuelto por el backend
    onCreated(created);

    onClose();
  } catch (err) {
    console.error("❌ Error al crear producto:", err);
    alert("Error al crear el producto");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Nuevo Producto</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del producto
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio (S/.)
            </label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            {submitting ? "Guardando..." : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
