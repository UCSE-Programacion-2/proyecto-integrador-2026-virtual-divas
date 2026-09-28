const ProductsService = (() => {
  const API_PRODUCTS_URL = 'http://localhost:3000/api/products';
  const fallbackImagesByCategory = {
    interior: 'assets/latexinterior.png',
    exterior: 'assets/Pintunort.png',
    esmalte: 'assets/Pinturavalen.png',
    accesorio: 'assets/Tonplast.png',
  };
  const categoryLabels = {
    interior: 'Pintura interior',
    exterior: 'Pintura exterior',
    esmalte: 'Esmalte',
    accesorio: 'Accesorio',
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  const escapeHtml = (text = '') =>
    String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const getProductImage = (product) =>
    product.imagen || fallbackImagesByCategory[product.categoria] || 'assets/Pintunort.png';

  const getCategoryLabel = (category) => categoryLabels[category] || category || 'Producto';

  const fetchProducts = async () => {
    const response = await fetch(API_PRODUCTS_URL);

    if (!response.ok) {
      throw new Error('No se pudieron obtener los productos');
    }

    return response.json();
  };

  const fetchProductById = async (productId) => {
    const response = await fetch(`${API_PRODUCTS_URL}/${encodeURIComponent(productId)}`);

    if (!response.ok) {
      throw new Error('No se pudo obtener el producto');
    }

    return response.json();
  };

  return {
    escapeHtml,
    fetchProductById,
    fetchProducts,
    formatPrice,
    getCategoryLabel,
    getProductImage,
  };
})();
