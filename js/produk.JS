/* ============================================
   PRODUK.JS - Script Halaman Info Ikan
   ============================================ */

let currentCategory = 'all';

function renderProducts() {
  const container = document.getElementById('product-grid'); 
  if (!container) return;

  const searchInput = document.getElementById('search-input');
  const search = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search) || product.desc.toLowerCase().includes(search);
    const matchCategory = currentCategory === 'all' || product.category === currentCategory;
    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:64px 0;"><iconify-icon icon="solar:fish-linear" style="font-size:48px; color:#d1d5db;"></iconify-icon><p style="color:#9ca3af; font-weight:500; margin-top:12px;">Tidak ada ikan ditemukan</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((product, index) => {
    // CARI LAPAK YANG MENJUAL PRODUK INI
    const productSellers = sellers.filter(seller => seller.productIds && seller.productIds.includes(product.id));

    // BUAT HTML BADGE LAPAK
    let sellersHtml = '';
    if (productSellers.length > 0) {
      sellersHtml = `
        <div style="margin-top:12px; padding-top:12px; border-top:1px dashed #e5e7eb;">
          <p style="font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Dijual oleh:</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${productSellers.map(s => `
              <a href="lapak.html" style="display:inline-flex; align-items:center; gap:4px; background:#f3f4f6; padding:4px 8px; border-radius:8px; font-size:11px; color:#374151; text-decoration:none; font-weight:500; transition:all 0.2s; border:1px solid #e5e7eb;" onmouseover="this.style.background='#e6f3fa'; this.style.color='#0077B6'; this.style.borderColor='#cce7f5'" onmouseout="this.style.background='#f3f4f6'; this.style.color='#374151'; this.style.borderColor='#e5e7eb'">
                <iconify-icon icon="solar:shop-2-linear" style="font-size:12px;"></iconify-icon>
                ${s.name}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="card product-card overflow-hidden animate-fadeInUp" style="animation-delay: ${index * 0.05}s; display:flex; flex-direction:column;">
        <div style="position:relative; overflow:hidden;">
          <img src="${product.img}" alt="${product.name}" class="product-img" style="width:100%; height:192px; object-fit:cover;">
          <div style="position:absolute; top:12px; left:12px;"><span style="padding:6px 12px; border-radius:12px; font-size:12px; font-weight:700; color:white; background:${product.status === 'Tersedia' ? '#2ECC71' : '#F39C12'};">${product.status}</span></div>
          <div style="position:absolute; top:12px; right:12px;">
            <button onclick="addToCart(${product.id})" style="width:40px; height:40px; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); border-radius:12px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:18px; color:#6b7280; box-shadow:0 2px 8px rgba(0,0,0,0.1); transition:all 0.2s;" onmouseover="this.style.background='#F39C12'; this.style.color='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.color='#6b7280'">
              <iconify-icon icon="solar:cart-plus-bold"></iconify-icon>
            </button>
          </div>
        </div>
        
        <div style="padding:20px; flex:1; display:flex; flex-direction:column;">
          <div style="margin-bottom:8px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:${product.category === 'laut' ? '#0077B6' : product.category === 'tawar' ? '#2ECC71' : '#F39C12'};">
              ${product.category === 'laut' ? 'Ikan Laut' : product.category === 'tawar' ? 'Ikan Tawar' : 'Udang & Kerang'}
            </span>
          </div>
          <h3 style="font-weight:700; font-size:18px; color:#111827; margin-bottom:4px;">${product.name}</h3>
          <p style="font-size:13px; color:#6b7280; margin-bottom:12px; line-height:1.5;">${product.desc}</p>
          
          <!-- INFORMASI LAPAK DITAMBAHKAN DI SINI -->
          ${sellersHtml}

          <div style="margin-top:auto; padding-top:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
              <div>
                <span style="font-weight:800; color:#0077B6; font-size:18px;">${formatRupiah(product.price)}</span>
                <span style="color:#9ca3af; font-size:12px;">/${product.unit}</span>
              </div>
            </div>
            <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width:100%; font-size:13px; padding:10px;" onmouseover="this.style.background='#F39C12'; this.style.boxShadow='0 8px 24px rgba(243,156,18,0.3)'" onmouseout="this.style.background='#0077B6'; this.style.boxShadow='none'">
              <iconify-icon icon="solar:cart-plus-bold" style="font-size:16px;"></iconify-icon> + Keranjang
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.cat-btn').forEach(btn => { 
    if (btn.dataset.cat === category) btn.classList.add('active'); 
    else btn.classList.remove('active'); 
  });
  renderProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', renderProducts);
});