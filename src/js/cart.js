const STORAGE_KEY = 'snegotehnika-cart';

export const getCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart:change'));
};

export const getCartCount = () =>
  getCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

export const addToCart = (item) => {
  const cart = getCart();
  const existing = cart.find((p) => p.id === item.id);
  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + (Number(item.qty) || 1);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      img: item.img || '',
      sku: item.sku || '',
      qty: Number(item.qty) || 1,
    });
  }
  saveCart(cart);
};

export const removeFromCart = (id) => {
  saveCart(getCart().filter((p) => p.id !== id));
};

export const setQty = (id, qty) => {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;
  item.qty = Math.max(1, Number(qty) || 1);
  saveCart(cart);
};

export const clearCart = () => {
  saveCart([]);
};

export const updateCartCount = () => {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  const count = getCartCount();
  el.textContent = count;
  el.classList.toggle('has-items', count > 0);
};

export const onCartChange = (handler) => {
  window.addEventListener('cart:change', handler);
};