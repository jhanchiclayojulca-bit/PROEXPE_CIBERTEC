import { useState, useEffect } from "react";
import { FileText, Download, Eye, Plus, X, Search } from "lucide-react";
import { api } from "../services/api";
import { generarFactura } from "../utils/pdfGenerator";
import type { Factura, DetalleFactura } from "../types/index";
import CrearFactura from "./CrearFactura";

export default function Facturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [detalle, setDetalle] = useState<DetalleFactura[]>([]);
  const [showCrear, setShowCrear] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      const data = await api.facturas.getAll();
      setFacturas(data);
    } catch (error) {
      console.error("Error al cargar facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (factura: Factura) => {
    try {
      const data = await api.facturas.getDetalle(Number(factura.Id_factura));
      setDetalle(data);
      setSelectedFactura(factura);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
    }
  };

  const descargarPDF = () => {
    if (selectedFactura && detalle.length > 0) {
      const detallesPDF = detalle.map((item) => ({
        Nombre_producto: item.Nombre_producto || "",
        Cantidad: item.Cantidad,
        Precio_unitario: item.Precio_unitario || 0,
        Subtotal: item.Subtotal,
      }));
      generarFactura(
        selectedFactura,
        detallesPDF,
        selectedFactura.empleado || "Empleado"
      );
    }
  };

  const handleFacturaCreada = (nuevaFactura: Factura) => {
    setFacturas((prev) => [nuevaFactura, ...prev]);
  };

  // Filtrar facturas según búsqueda
  const filteredFacturas = facturas.filter(
    (f) =>
      f.Id_factura.toString().includes(search.toLowerCase()) ||
      f.empleado?.toLowerCase().includes(search.toLowerCase())
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Facturas</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-64 border border-gray-200">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por Nro o Empleado"
              className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Botón nueva factura */}
          <button
            onClick={() => setShowCrear(true)}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md"
          >
            <Plus className="w-4 h-4" /> Nueva Factura
          </button>
        </div>
      </div>

      {/* Tabla de facturas */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Nro. Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFacturas.length > 0 ? (
                filteredFacturas.map((factura, i) => (
                  <tr
                    key={factura.Id_factura}
                    className={`transition hover:bg-red-50 ${
                      i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{factura.Id_factura}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(factura.Fecha).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {factura.Hora}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          factura.Tipo === "Factura"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {factura.Tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {factura.empleado}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => verDetalle(factura)}
                        className="flex items-center gap-1 text-red-600 font-medium hover:text-red-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 text-sm"
                  >
                    No se encontraron facturas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle (se mantiene igual) */}
      {selectedFactura && detalle.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedFactura(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Detalle de comprobante
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={descargarPDF}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
                <button
                  onClick={() => setSelectedFactura(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Info general */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold">
                  {new Date(selectedFactura.Fecha).toLocaleDateString("es-PE")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="font-semibold">{selectedFactura.Hora}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold">{selectedFactura.Tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Atendido por</p>
                <p className="font-semibold">{selectedFactura.empleado}</p>
              </div>
            </div>

            {/* Detalle productos */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detalle.map((item) => (
                    <tr key={item.Id_detalle_factura}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.Nombre_producto}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        S/ {item.Precio_unitario?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.Cantidad}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        S/ {item.Subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="mt-6 space-y-2 text-right">
              <div className="flex justify-end gap-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  S/{" "}
                  {detalle
                    .reduce((sum, item) => sum + item.Subtotal, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-gray-600">IGV (18%):</span>
                <span className="font-semibold">
                  S/{" "}
                  {(
                    detalle.reduce((sum, item) => sum + item.Subtotal, 0) * 0.18
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end gap-4 text-xl pt-2 border-t-2">
                <span className="text-gray-800 font-bold">TOTAL:</span>
                <span className="text-red-600 font-bold">
                  S/{" "}
                  {(
                    detalle.reduce((sum, item) => sum + item.Subtotal, 0) * 1.18
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Factura */}
      {showCrear && (
        <CrearFactura
          onClose={() => setShowCrear(false)}
          onCreated={handleFacturaCreada}
        />
      )}
    </div>
  );
}
