const ProductsService = (() => {
  const API_PRODUCTS_URL = `${AppConfig.API_URL}/products`;
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

  // filters: { q, categoria } (opcionales)
  const fetchProducts = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    const response = await fetch(query ? `${API_PRODUCTS_URL}?${query}` : API_PRODUCTS_URL);

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

  // Headers con el token guardado en el login (para rutas de admin)
  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    API_PRODUCTS_URL,
    authHeaders,
    escapeHtml,
    fetchProductById,
    fetchProducts,
    formatPrice,
    getCategoryLabel,
    getProductImage,
  };
})();
