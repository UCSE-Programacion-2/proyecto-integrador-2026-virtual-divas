export const CATEGORIES = [
  { value: 'interior', label: 'Pintura interior', icon: '🏠' },
  { value: 'exterior', label: 'Pintura exterior', icon: '🏗️' },
  { value: 'esmalte', label: 'Esmaltes', icon: '✨' },
  { value: 'accesorio', label: 'Accesorios', icon: '🖌️' },
];

const fallbackImages = {
  interior: '/assets/latexinterior.png',
  exterior: '/assets/Pintunort.png',
  esmalte: '/assets/Pinturavalen.png',
  accesorio: '/assets/Tonplast.png',
};

export const formatPrice = price =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price || 0);

export const getCategoryLabel = value =>
  CATEGORIES.find(category => category.value === value)?.label || value || 'Producto';

// Si el producto no tiene imagen usa una por categoría.
// Las rutas tipo "assets/x.png" (del vanilla) se pasan a absolutas.
export const getProductImage = product => {
  const image = product?.imagen;
  if (!image) return fallbackImages[product?.categoria] || '/assets/Pintunort.png';
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/') || image.startsWith('data:')) {
    return image;
  }
  return `/${image}`;
};

export const formatDate = date =>
  new Date(date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
