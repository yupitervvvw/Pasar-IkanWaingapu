function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;
  const featured = products.slice(0, 4);
  container.innerHTML = featured
    .map(
      (product, index) => `
    <div class="card product-card overflow-hidden animate-fadeInUp" style="animation-delay: ${index * 0.1}s">
      <div style="position:relative; overflow:hidden;">
        <img src="${product.img}" alt="${product.name}" class="product-img" style="width:100%; height:192px; object-fit:cover;">
        <div style="position:absolute; top:12px; left:12px;">
          <span style="padding:6px 12px; border-radius:12px; font-size:12px; font-weight:700; color:white; background:${product.status === "Tersedia" ? "#2ECC71" : "#F39C12"};">${product.status}</span>
        </div>
      </div>
      <div style="padding:20px;">
        <h3 style="font-weight:700; font-size:18px; color:#111827; margin-bottom:4px;">${product.name}</h3>
        <p style="font-size:14px; color:#9ca3af; margin-bottom:12px; line-height:1.5;">${product.desc}</p>
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div><span style="font-weight:800; color:#0077B6; font-size:16px;">${formatRupiah(product.price)}</span><span style="color:#9ca3af; font-size:12px;">/${product.unit}</span></div>
          <button onclick="addToCart(${product.id})" class="btn btn-sm" style="background:#e6f3fa; color:#0077B6; border-radius:12px;" onmouseover="this.style.background='#F39C12'; this.style.color='white'" onmouseout="this.style.background='#e6f3fa'; this.style.color='#0077B6'">
            <iconify-icon icon="solar:cart-plus-bold" style="font-size:16px;"></iconify-icon> Tambah
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}
document.addEventListener("DOMContentLoaded", renderFeaturedProducts);
