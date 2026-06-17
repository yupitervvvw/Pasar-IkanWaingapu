function renderCart() {
  const container = document.getElementById("cart-items");
  const emptyState = document.getElementById("cart-empty");
  const summaryCard = document.getElementById("cart-summary-card");
  if (!container || !emptyState || !summaryCard) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "block";
    summaryCard.style.display = "none";
    return;
  }
  emptyState.style.display = "none";
  summaryCard.style.display = "block";
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="card animate-scaleIn" style="padding:16px; display:flex; gap:16px; align-items:center;">
      <img src="${item.img}" alt="${item.name}" style="width:80px; height:80px; border-radius:12px; object-fit:cover; flex-shrink:0;">
      <div style="flex:1; min-width:0;">
        <h4 style="font-weight:700; font-size:15px; color:#111827;">${item.name}</h4>
        <p style="font-size:13px; color:#9ca3af; margin:4px 0 8px;">${formatRupiah(item.price)} / ${item.unit}</p>
        <div class="qty-control">
          <button class="qty-btn minus" onclick="updateCartQty(${item.id}, -1)"><iconify-icon icon="solar:minus-circle-linear"></iconify-icon></button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn plus" onclick="updateCartQty(${item.id}, 1)"><iconify-icon icon="solar:add-circle-linear"></iconify-icon></button>
        </div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <p style="font-weight:800; color:#0077B6; font-size:15px;">${formatRupiah(item.price * item.qty)}</p>
        <button onclick="removeFromCart(${item.id})" style="margin-top:8px; background:none; border:none; color:#d1d5db; cursor:pointer; font-size:18px; transition:color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#d1d5db'"><iconify-icon icon="solar:trash-bin-trash-linear"></iconify-icon></button>
      </div>
    </div>
  `,
    )
    .join("");
  updateCartSummary(cart);
}

function updateCartSummary(cart) {
  const subtotalEl = document.getElementById("cart-subtotal");
  const serviceEl = document.getElementById("cart-service");
  const totalEl = document.getElementById("cart-total");
  if (!subtotalEl || !serviceEl || !totalEl) return;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const service = Math.round(subtotal * 0.02);
  const total = subtotal + service;
  subtotalEl.textContent = formatRupiah(subtotal);
  serviceEl.textContent = formatRupiah(service);
  totalEl.textContent = formatRupiah(total);
}

/**
 * Proses checkout: Simpan data keranjang & arahkan ke halaman pesan
 */
function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // 1. Pindahkan data keranjang ke sesi checkout
  localStorage.setItem('pending_checkout', JSON.stringify(cart));
  
  // 2. Arahkan ke halaman pesan ikan
  window.location.href = 'pesan.html';
}

document.addEventListener("DOMContentLoaded", renderCart);
