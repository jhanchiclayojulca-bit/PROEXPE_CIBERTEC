import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Factura } from '../types/index';

export const generarReporteVentasEmpleado = (data: Array<{ cod_empleado: string; Empleado: string; Total_Ventas: number }>) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Pardos Chicken - Reporte de Ventas por Empleado', 14, 20);

  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Código', 'Empleado', 'Total Ventas']],
    body: data.map(item => [
      item.cod_empleado,
      item.Empleado,
      `S/ ${item.Total_Ventas.toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });

  const total = data.reduce((sum, item) => sum + item.Total_Ventas, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 35;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total General: S/ ${total.toFixed(2)}`, 14, finalY + 10);

  doc.save('reporte-ventas-empleado.pdf');
};

export const generarReporteProductosTop = (data: Array<{ Nombre_producto: string; Total_Cantidad: number; Total_Vendido: number }>) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Pardos Chicken - Top 3 Productos Más Vendidos', 14, 20);

  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Producto', 'Cantidad Vendida', 'Total Vendido']],
    body: data.map(item => [
      item.Nombre_producto,
      item.Total_Cantidad.toString(),
      `S/ ${item.Total_Vendido.toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });

  doc.save('reporte-productos-top.pdf');
};

export const generarReporteIngresosDiarios = (data: Array<{ Fecha: string; Facturas_Emitidas: number; Total_Diario: number }>) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Pardos Chicken - Reporte de Ingresos Diarios', 14, 20);

  doc.setFontSize(11);
  doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [['Fecha', 'Facturas Emitidas', 'Total Diario']],
    body: data.map(item => [
      new Date(item.Fecha).toLocaleDateString(),
      item.Facturas_Emitidas.toString(),
      `S/ ${item.Total_Diario.toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38] },
  });

  const total = data.reduce((sum, item) => sum + item.Total_Diario, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 35;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Acumulado: S/ ${total.toFixed(2)}`, 14, finalY + 10);

  doc.save('reporte-ingresos-diarios.pdf');
};

export const generarFactura = (
  factura: Factura,   // ✅ ahora usas tu tipo real
  detalles: Array<{ Nombre_producto: string; Cantidad: number; Precio_unitario: number; Subtotal: number }>,
  empleado: string
) => {
  const doc = new jsPDF();

  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PARDOS CHICKEN', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('El Sabor de la Tradición', 14, 28);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${factura.Tipo.toUpperCase()}`, 14, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Número: ${factura.Id_factura}`, 14, 58);
  doc.text(`Fecha: ${new Date(factura.Fecha).toLocaleDateString()}`, 14, 64);
  doc.text(`Hora: ${factura.Hora}`, 14, 70);
  doc.text(`Atendido por: ${empleado}`, 14, 76);

  autoTable(doc, {
    startY: 85,
    head: [['Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
    body: detalles.map(item => [
      item.Nombre_producto,
      item.Cantidad.toString(),
      `S/ ${item.Precio_unitario.toFixed(2)}`,
      `S/ ${item.Subtotal.toFixed(2)}`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
  });

  const subtotal = detalles.reduce((sum, item) => sum + item.Subtotal, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;
  const finalY = (doc as any).lastAutoTable.finalY || 85;

  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, 130, finalY + 10);
  doc.text(`S/ ${subtotal.toFixed(2)}`, 170, finalY + 10);

  doc.text(`IGV (18%):`, 130, finalY + 16);
  doc.text(`S/ ${igv.toFixed(2)}`, 170, finalY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL:`, 130, finalY + 24);
  doc.text(`S/ ${total.toFixed(2)}`, 170, finalY + 24);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Gracias por su preferencia', 105, finalY + 35, { align: 'center' });

  doc.save(`factura-${factura.Id_factura}.pdf`);
};
