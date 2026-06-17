/* ============================================
   LAPAK.JS - Script Halaman Lapak Penjual
   ============================================ */

let currentSellerCategory = 'all';

function renderSellers() {
  const container = document.getElementById('seller-grid');
  if (!container) return;

  const searchInput = document.getElementById('seller-search');
  const search = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = sellers.filter(seller => {
    const matchSearch = seller.name.toLowerCase().includes(search) || seller.address.toLowerCase().includes(search) || seller.desc.toLowerCase().includes(search);
    const matchCategory = currentSellerCategory === 'all' || seller.category === currentSellerCategory;
    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:64px 0;"><iconify-icon icon="solar:shop-2-linear" style="font-size:48px; color:#d1d5db;"></iconify-icon><p style="color:#9ca3af; font-weight:500; margin-top:12px;">Lapak tidak ditemukan</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((seller, index) => {
    const productSellers = seller.productIds && seller.productIds ? seller.productIds : [];
    const sellerProducts = productSellers.map(pId => products.find(p => p.id === pId)).filter(Boolean);

    let productsHtml = '';
    if(sellerProducts.length > 0) {
      productsHtml = `
        <div style="margin-bottom:16px;">
          <p style="font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">Produk di lapak ini:</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${sellerProducts.map(p => `
              <span style="font-size:11px; background:#f3f4f6; color:#374151; padding:4px 8px; border-radius:6px; display:flex; align-items:center; gap:4px; border:1px solid #e5e7eb;">
                <img src="${p.img}" style="width:16px; height:16px; border-radius:4px; object-fit:cover;">
                ${p.name}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="card animate-fadeInUp" style="animation-delay: ${index * 0.05}s; overflow:hidden; display:flex; flex-direction:column;">
        <div style="position:relative; overflow:hidden;">
          <img src="${seller.img}" alt="${seller.name}" class="product-img" style="width:100%; height:200px; object-fit:cover;">
          <div style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.95); backdrop-filter:blur(8px); padding:4px 10px; border-radius:8px; font-size:12px; font-weight:700; color:#111827; display:flex; align-items:center; gap:4px;">
            <iconify-icon icon="solar:star-bold" style="color:#F39C12;"></iconify-icon> ${seller.rating}
          </div>
        </div>
        <div style="padding:20px; flex:1; display:flex; flex-direction:column;">
          <div style="margin-bottom:6px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:${seller.category === 'laut' ? '#0077B6' : seller.category === 'tawar' ? '#2ECC71' : '#F39C12'};">
              ${seller.category === 'laut' ? 'Ikan Laut' : seller.category === 'tawar' ? 'Ikan Tawar' : 'Udang & Kerang'}
            </span>
          </div>
          <h3 style="font-weight:700; font-size:18px; color:#111827; margin-bottom:6px;">${seller.name}</h3>
          <p style="font-size:13px; color:#6b7280; margin-bottom:12px; line-height:1.5;">${seller.desc}</p>
          <div style="display:flex; align-items:flex-start; gap:6px; margin-bottom:16px; font-size:13px; color:#6b7280;">
            <iconify-icon icon="solar:map-point-linear" style="font-size:16px; color:#0077B6; flex-shrink:0; margin-top:2px;"></iconify-icon>
            <span>${seller.address}</span>
          </div>
          
          ${productsHtml}

          <div style="margin-top:auto;">
            <button onclick="viewSellerOnMap(${seller.id})" class="btn btn-primary" style="width:100%; font-size:13px; padding:10px;">
              <iconify-icon icon="solar:map-linear" style="font-size:16px;"></iconify-icon> Lihat di Peta
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setSellerCategory(category) {
  currentSellerCategory = category;
  document.querySelectorAll('.seller-cat-btn').forEach(btn => {
    if (btn.dataset.cat === category) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderSellers();
}

// DISESUAIKAN: Karena semua lapak ada di 1 lokasi pasar, 
// fungsi ini hanya meng-scroll ke bagian peta, bukan mengubah lokasi map.
function viewSellerOnMap(sellerId) {
  const seller = sellers.find(s => s.id === sellerId);
  if (!seller) return;

  // Scroll ke peta
  const mapSection = document.getElementById('map-section');
  if(mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });

  showToast('Lokasi Lapak', seller.name + ' berada di Pasar Ikan Segar WGP');
}

document.addEventListener('DOMContentLoaded', () => {
  renderSellers();
  const searchInput = document.getElementById('seller-search');
  if (searchInput) searchInput.addEventListener('input', renderSellers);
});