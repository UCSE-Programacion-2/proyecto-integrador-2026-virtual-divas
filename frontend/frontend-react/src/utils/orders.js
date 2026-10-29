export const PAYMENT_METHODS = [
  {
    value: 'efectivo',
    title: 'Efectivo al retirar',
    description: 'Pagás en el local al momento de retirar el pedido.',
  },
  {
    value: 'transferencia',
    title: 'Transferencia bancaria',
    description: 'Recibís los datos para transferir al confirmar.',
  },
  {
    value: 'tarjeta',
    title: 'Tarjeta en mostrador',
    description: 'Abonás con tarjeta al retirar en sucursal.',
  },
];

export const ORDER_STATUS = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const getPaymentLabel = value =>
  PAYMENT_METHODS.find(method => method.value === value)?.title || value;

// Número corto y legible para mostrar al cliente
export const getOrderNumber = order => `#${order._id.slice(-6).toUpperCase()}`;
