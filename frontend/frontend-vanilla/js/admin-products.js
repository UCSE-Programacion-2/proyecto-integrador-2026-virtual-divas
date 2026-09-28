const API_PRODUCTS_URL = 'http://localhost:3000/api/products';
const productForm = document.getElementById('product-form');
const productsBody = document.getElementById('products-body');
const productsCount = document.getElementById('products-count');
const adminMessage = document.getElementById('admin-message');
const submitButton = document.getElementById('product-submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

let products = [];
let editingProductId = null;

const showMessage = (message, type) => {
  adminMessage.textContent = message;
  adminMessage.className = `admin-message visible ${type}`;
};

const getFormData = () => {
  const formData = new FormData(productForm);

  return {
    nombre: formData.get('nombre').trim(),
    marca: formData.get('marca').trim(),
    categoria: formData.get('categoria'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagen: formData.get('imagen').trim(),
    descripcion: formData.get('descripcion').trim(),
  };
};

const fillForm = (product) => {
  productForm.nombre.value = product.nombre;
  productForm.marca.value = product.marca;
  productForm.categoria.value = product.categoria;
  productForm.precio.value = product.precio;
  productForm.stock.value = product.stock;
  productForm.imagen.value = product.imagen || '';
  productForm.descripcion.value = product.descripcion || '';
};

const resetForm = () => {
  productForm.reset();
  editingProductId = null;
  submitButton.textContent = 'Crear Producto';
  cancelEditButton.hidden = true;
};

const renderProducts = () => {
  productsCount.textContent = `${products.length} productos`;

  if (products.length === 0) {
    productsBody.innerHTML = '<tr><td colspan="6">No hay productos cargados.</td></tr>';
    return;
  }

  productsBody.innerHTML = products
    .map((product) => {
      const image = ProductsService.getProductImage(product);
      const statusClass = product.stock > 10 ? 'status-active' : 'status-low';
      const statusText = product.stock > 10 ? 'Activo' : 'Stock bajo';

      return `
        <tr>
          <td data-label="Producto">
            <div class="product-cell">
              <img class="product-thumb" src="${ProductsService.escapeHtml(image)}" alt="${ProductsService.escapeHtml(product.nombre)}" />
              <div>
                <p class="product-name">${ProductsService.escapeHtml(product.nombre)}</p>
                <p class="product-brand">${ProductsService.escapeHtml(product.marca)}</p>
              </div>
            </div>
          </td>
          <td data-label="Categoría">${ProductsService.getCategoryLabel(product.categoria)}</td>
          <td data-label="Precio">${ProductsService.formatPrice(product.precio)}</td>
          <td data-label="Stock">${product.stock}</td>
          <td data-label="Estado"><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td data-label="Acciones">
            <div class="table-actions">
              <button type="button" class="button button-secondary button-small" data-action="edit" data-id="${product._id}">Editar</button>
              <button type="button" class="button button-danger button-small" data-action="delete" data-id="${product._id}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
};

const loadProducts = async () => {
  try {
    products = await ProductsService.fetchProducts();
    renderProducts();
  } catch (error) {
    console.error(error);
    productsBody.innerHTML = '<tr><td colspan="6">No se pudieron cargar los productos.</td></tr>';
  }
};

const saveProduct = async (productData) => {
  const url = editingProductId ? `${API_PRODUCTS_URL}/${editingProductId}` : API_PRODUCTS_URL;
  const method = editingProductId ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('No se pudo guardar el producto');
  }
};

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await saveProduct(getFormData());
    showMessage('Producto guardado correctamente.', 'success');
    resetForm();
    loadProducts();
  } catch (error) {
    console.error(error);
    showMessage('No se pudo guardar el producto.', 'error');
  }
});

productsBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const productId = button.dataset.id;
  const action = button.dataset.action;
  const product = products.find((item) => item._id === productId);

  if (action === 'edit' && product) {
    editingProductId = productId;
    submitButton.textContent = 'Actualizar Producto';
    cancelEditButton.hidden = false;
    fillForm(product);
  }

  if (action === 'delete') {
    const confirmDelete = confirm('¿Eliminar este producto?');

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_PRODUCTS_URL}/${productId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto');
      }

      showMessage('Producto eliminado correctamente.', 'success');
      loadProducts();
    } catch (error) {
      console.error(error);
      showMessage('No se pudo eliminar el producto.', 'error');
    }
  }
});

cancelEditButton.addEventListener('click', resetForm);

loadProducts();
