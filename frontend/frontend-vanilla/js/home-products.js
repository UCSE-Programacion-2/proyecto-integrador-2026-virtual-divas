const productosGrid = document.getElementById('productos-destacados');

const createProductCard = (product) => {
  const image = ProductsService.getProductImage(product);
  const detailUrl = `detalle.html?id=${encodeURIComponent(product._id)}`;

  return `
    <div class="producto-card">
      <div class="producto-imagen">
        <img src="${ProductsService.escapeHtml(image)}" alt="${ProductsService.escapeHtml(product.nombre)}">
      </div>
      <div class="producto-info">
        <p class="producto-marca">${ProductsService.escapeHtml(product.marca)}</p>
        <h3 class="producto-nombre">${ProductsService.escapeHtml(product.nombre)}</h3>
        <p class="producto-precio">${ProductsService.formatPrice(product.precio)}</p>
        <a href="${detailUrl}" class="btn btn-primario">Ver detalle</a>
      </div>
    </div>
  `;
};

const showProductsMessage = (message) => {
  productosGrid.innerHTML = `<p class="productos-mensaje">${message}</p>`;
};

const loadHomeProducts = async () => {
  try {
    const products = await ProductsService.fetchProducts();

    if (!products.length) {
      showProductsMessage('No hay productos disponibles por el momento.');
      return;
    }

    productosGrid.innerHTML = products.map(createProductCard).join('');
  } catch (error) {
    console.error(error);
    showProductsMessage('No se pudieron cargar los productos. Intentá nuevamente más tarde.');
  }
};

loadHomeProducts();
