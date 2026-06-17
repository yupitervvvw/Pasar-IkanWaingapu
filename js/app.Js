function getCart() {
  const data = localStorage.getItem("freshcatch_cart");
  return data ? JSON.parse(data) : [];
}
function saveCart(cart) {
  localStorage.setItem("freshcatch_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  let cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast("Ditambahkan!", `${product.name} masuk ke keranjang`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
  if (typeof renderCart === "function") renderCart();
}

function updateCartQty(productId, delta) {
  let cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  updateCartBadge();
  if (typeof renderCart === "function") renderCart();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.classList.add("show");
  } else {
    badge.classList.remove("show");
  }
}

function clearCart() {
  localStorage.removeItem("freshcatch_cart");
  updateCartBadge();
}

function showToast(title, message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  const icon = toast.querySelector(".toast-icon iconify-icon");
  const iconWrap = toast.querySelector(".toast-icon");
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-msg").textContent = message;
  if (type === "warning") {
    icon.setAttribute("icon", "solar:danger-triangle-bold");
    iconWrap.className = "toast-icon warning";
  } else {
    icon.setAttribute("icon", "solar:check-circle-bold");
    iconWrap.className = "toast-icon success";
  }
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("show");
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) menu.classList.toggle("open");
}
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });
}

function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}
function initApp() {
  updateCartBadge();
  initNavbarScroll();
}
document.addEventListener("DOMContentLoaded", initApp);
