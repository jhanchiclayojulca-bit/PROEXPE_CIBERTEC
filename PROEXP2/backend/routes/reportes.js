import express from "express";
import {
  getVentasDelDia,
  getPedidosActivos,
  getFacturasEmitidas,
  getReservasHoy,
  getProductosMasVendidos,
  getRendimientoEmpleados
} from "../controller/reportesController.js";

const router = express.Router();

router.get("/ventas-dia", getVentasDelDia);
router.get("/pedidos-activos", getPedidosActivos);
router.get("/facturas-emitidas", getFacturasEmitidas);
router.get("/reservas-hoy", getReservasHoy);
router.get("/productos-top", getProductosMasVendidos);
router.get("/empleados-rendimiento", getRendimientoEmpleados);

export default router;
