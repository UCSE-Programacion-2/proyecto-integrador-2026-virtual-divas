const cartBody = document.getElementById('cart-body');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartShipping = document.getElementById('cart-shipping');
const cartTotal = document.getElementById('cart-total');

const renderCart = () => {
  const cart = CartService.getCart();
  const subtotal = CartService.getTotal();
  const shipping = cart.length > 0 ? 1500 : 0;

  cartCount.textContent = `${cart.length} productos`;
  cartSubtotal.textContent = ProductsService.formatPrice(subtotal);
  cartShipping.textContent = ProductsService.formatPrice(shipping);
  cartTotal.textContent = ProductsService.formatPrice(subtotal + shipping);

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="5">No hay productos en el carrito.</td>
      </tr>
    `;
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (item) => `
        <tr>
          <td data-label="Producto">
            <div class="cart-product-cell">
              <img src="${ProductsService.escapeHtml(item.imagen)}" alt="${ProductsService.escapeHtml(item.nombre)}" />
              <div>
                <p class="cart-product-name">${ProductsService.escapeHtml(item.nombre)}</p>
                <p class="cart-product-brand">${ProductsService.escapeHtml(item.marca)} · ${ProductsService.getCategoryLabel(item.categoria)}</p>
              </div>
            </div>
          </td>
          <td data-label="Precio">${ProductsService.formatPrice(item.precio)}</td>
          <td data-label="Cantidad">
            <div class="quantity-control">
              <button type="button" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </td>
          <td data-label="Subtotal"><strong>${ProductsService.formatPrice(item.precio * item.quantity)}</strong></td>
          <td data-label="Acción">
            <button type="button" class="remove-button" data-action="remove" data-id="${item.id}">Quitar</button>
          </td>
        </tr>
      `,
    )
    .join('');
};

cartBody.addEventListener('click', (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const productId = button.dataset.id;
  const action = button.dataset.action;
  const product = CartService.getCart().find((item) => item.id === productId);

  if (!product && action !== 'remove') {
    return;
  }

  if (action === 'remove') {
    CartService.removeProduct(productId);
  }

  if (action === 'increase') {
    CartService.updateQuantity(productId, product.quantity + 1);
  }

  if (action === 'decrease') {
    CartService.updateQuantity(productId, product.quantity - 1);
  }

  renderCart();
});

renderCart();
