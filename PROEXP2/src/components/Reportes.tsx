import { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import {
  generarReporteVentasEmpleado,
  generarReporteProductosTop,
  generarReporteIngresosDiarios
} from '../utils/pdfGenerator';
import type { ReporteVentasEmpleado, ReporteProductoTop, ReporteIngresosDiarios } from '../types/index';

export default function Reportes() {
  const [ventasEmpleado, setVentasEmpleado] = useState<ReporteVentasEmpleado[]>([]);
  const [productosTop, setProductosTop] = useState<ReporteProductoTop[]>([]);
  const [ingresosDiarios, setIngresosDiarios] = useState<ReporteIngresosDiarios[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    try {
      const [ventas, productos, ingresos] = await Promise.all([
        api.reportes.ventasEmpleado(),
        api.reportes.productosTop(),
        api.reportes.ingresosDiarios(),
      ]);
      setVentasEmpleado(ventas);
      setProductosTop(productos);
      setIngresosDiarios(ingresos);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-red-600" />
        <h2 className="text-3xl font-bold text-gray-800">Reportes</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Ventas por Empleado</h3>
          </div>
          <button
            onClick={() => generarReporteVentasEmpleado(ventasEmpleado)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Ventas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventasEmpleado.map((item) => (
                <tr key={item.cod_empleado} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.cod_empleado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Empleado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    S/ {item.Total_Ventas.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-red-50 font-bold">
                <td colSpan={2} className="px-6 py-4 text-sm text-right text-gray-900">
                  TOTAL GENERAL:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">
                  S/ {ventasEmpleado.reduce((sum, item) => sum + item.Total_Ventas, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Top 3 Productos Más Vendidos</h3>
          </div>
          <button
            onClick={() => generarReporteProductosTop(productosTop)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productosTop.map((item, index) => (
            <div
              key={item.Nombre_producto}
              className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border-2 border-red-200"
            >
              <div className="absolute -top-3 -left-3 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-2">
                {item.Nombre_producto}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad vendida:</span>
                  <span className="font-bold text-gray-800">{item.Total_Cantidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total vendido:</span>
                  <span className="font-bold text-red-600">S/ {item.Total_Vendido.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">Ingresos Diarios</h3>
          </div>
          <button
            onClick={() => generarReporteIngresosDiarios(ingresosDiarios)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Facturas Emitidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Diario
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingresosDiarios.map((item) => (
                <tr key={item.Fecha} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.Fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Facturas_Emitidas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    S/ {item.Total_Diario.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-red-50 font-bold">
                <td colSpan={2} className="px-6 py-4 text-sm text-right text-gray-900">
                  TOTAL ACUMULADO:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">
                  S/ {ingresosDiarios.reduce((sum, item) => sum + item.Total_Diario, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
