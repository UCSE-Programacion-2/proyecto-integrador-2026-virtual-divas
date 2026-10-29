const catalogGrid = document.getElementById('catalog-grid');
const catalogCount = document.getElementById('catalog-count');
const catalogFilters = document.getElementById('catalog-filters');
const catalogSearch = document.getElementById('catalog-search');

const createCatalogCard = (product) => {
  const image = ProductsService.getProductImage(product);
  const detailUrl = `detalle.html?id=${encodeURIComponent(product._id)}`;

  return `
    <article class="card catalog-card">
      <div class="catalog-image">
        <img src="${ProductsService.escapeHtml(image)}" alt="${ProductsService.escapeHtml(product.nombre)}" />
      </div>
      <div class="catalog-info">
        <p class="catalog-brand">${ProductsService.escapeHtml(product.marca)}</p>
        <h3>${ProductsService.escapeHtml(product.nombre)}</h3>
        <p class="catalog-description">${ProductsService.escapeHtml(product.descripcion || '')}</p>
        <p class="catalog-price">${ProductsService.formatPrice(product.precio)}</p>
        <a href="${detailUrl}" class="button button-primary">Ver detalle</a>
      </div>
    </article>
  `;
};

const showCatalogMessage = (message) => {
  catalogGrid.innerHTML = `<p class="catalog-message">${message}</p>`;
  catalogCount.textContent = '0 productos';
};

const loadCatalog = async () => {
  const formData = new FormData(catalogFilters);
  const filters = { q: formData.get('q').trim(), categoria: formData.get('categoria') };

  showCatalogMessage('Cargando productos...');

  try {
    const products = await ProductsService.fetchProducts(filters);

    if (!products.length) {
      showCatalogMessage('No encontramos productos con esos filtros.');
      return;
    }

    catalogCount.textContent = `${products.length} productos`;
    catalogGrid.innerHTML = products.map(createCatalogCard).join('');
  } catch (error) {
    console.error(error);
    showCatalogMessage('No se pudieron cargar los productos. Intentá nuevamente más tarde.');
  }
};

// Espera a que el usuario deje de escribir para no pedir en cada tecla
let searchTimeout;
catalogSearch.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadCatalog, 350);
});

catalogFilters.addEventListener('change', loadCatalog);
catalogFilters.addEventListener('submit', (event) => {
  event.preventDefault();
  loadCatalog();
});
catalogFilters.addEventListener('reset', () => setTimeout(loadCatalog));

// Permite llegar con ?q=texto desde otra página
const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery) {
  catalogSearch.value = initialQuery;
}

loadCatalog();
