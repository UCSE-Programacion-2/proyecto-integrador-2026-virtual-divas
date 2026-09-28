const showProductMessage = (title, message) => {
  document.getElementById('hero-product-name').textContent = title;
  document.getElementById('hero-product-brand').textContent = '';
  document.getElementById('product-detail-title').textContent = title;
  document.getElementById('product-brand').textContent = '';
  document.getElementById('product-description').textContent = message;
  document.getElementById('product-price').textContent = '-';
  document.getElementById('product-stock').textContent = '-';
};

const renderProductDetail = (product) => {
  const image = ProductsService.getProductImage(product);
  const category = ProductsService.getCategoryLabel(product.categoria);
  const stockText = `${product.stock || 0} unidades`;

  document.title = `PintuNort - ${product.nombre}`;
  document.getElementById('hero-product-name').textContent = product.nombre;
  document.getElementById('hero-product-brand').textContent = product.marca;
  document.getElementById('product-detail-title').textContent = product.nombre;
  document.getElementById('product-brand').textContent = product.marca;
  document.getElementById('product-description').textContent =
    product.descripcion || 'Producto disponible en PintuNort.';
  document.getElementById('product-category').textContent = category;
  document.getElementById('product-price').textContent = ProductsService.formatPrice(product.precio);
  document.getElementById('product-stock').textContent = stockText;

  const mainImage = document.getElementById('product-main-img');
  const thumbnailImage = document.getElementById('product-thumb-img');
  mainImage.src = image;
  mainImage.alt = product.nombre;
  thumbnailImage.src = image;
  thumbnailImage.alt = `Vista frontal de ${product.nombre}`;

  const addCartButton = document.getElementById('add-cart-button');
  addCartButton.onclick = () => {
    CartService.addProduct(product);
    addCartButton.textContent = 'Producto agregado';

    setTimeout(() => {
      addCartButton.textContent = 'Agregar al carrito';
    }, 1500);
  };
};

const loadProductDetail = async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showProductMessage('Producto no seleccionado', 'Volvé al catálogo o al inicio y elegí un producto para ver su detalle.');
    return;
  }

  showProductMessage('Cargando producto...', 'Estamos obteniendo la información actualizada del producto.');

  try {
    const product = await ProductsService.fetchProductById(productId);
    renderProductDetail(product);
  } catch (error) {
    console.error(error);
    showProductMessage('Producto no disponible', 'No pudimos cargar el detalle del producto. Intentá nuevamente más tarde.');
  }
};

loadProductDetail();
