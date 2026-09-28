const CartService = (() => {
  const CART_KEY = 'pintunortCart';

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const addProduct = (product) => {
    const cart = getCart();
    const productId = product._id || product.id;
    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: productId,
        nombre: product.nombre,
        marca: product.marca,
        categoria: product.categoria,
        precio: product.precio,
        imagen: ProductsService.getProductImage(product),
        quantity: 1,
      });
    }

    saveCart(cart);
  };

  const removeProduct = (productId) => {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
  };

  const updateQuantity = (productId, quantity) => {
    const cart = getCart();
    const product = cart.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    product.quantity = quantity;

    if (product.quantity <= 0) {
      removeProduct(productId);
      return;
    }

    saveCart(cart);
  };

  const getTotal = () => getCart().reduce((total, item) => total + item.precio * item.quantity, 0);

  return {
    addProduct,
    getCart,
    getTotal,
    removeProduct,
    updateQuantity,
  };
})();
