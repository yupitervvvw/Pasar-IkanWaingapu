 let checkoutMode = false;
    let checkoutItems = [];
    let sellerGroups = {}; // Menyimpan item yang dikelompokkan per lapak

    // Isi dropdown ikan
    function populateFishSelect() {
      const select = document.getElementById('order-fish'); 
      if (!select) return;
      select.innerHTML = '<option value="">-- Pilih jenis ikan --</option>';
      products.forEach(product => { 
        const option = document.createElement('option'); 
        option.value = product.id; 
        option.textContent = `${product.name} - ${formatRupiah(product.price)}/${product.unit}`; 
        select.appendChild(option); 
      });
    }

    // Deteksi apakah user datang dari checkout keranjang
    function checkCheckoutSession() {
      const pendingData = localStorage.getItem('pending_checkout');
      if (pendingData) {
        checkoutItems = JSON.parse(pendingData);
        checkoutMode = true;

        // Sembunyikan form manual
        document.getElementById('manual-order-section').style.display = 'none';
        document.getElementById('seller-selection-container').style.display = 'none';
        document.getElementById('btn-manual-submit').style.display = 'none';
        
        // Tampilkan mode keranjang
        document.getElementById('cart-checkout-section').style.display = 'block';
        document.getElementById('split-checkout-buttons').style.display = 'block';

        // Kelompokkan item berdasarkan lapak & render UI
        groupItemsBySeller();
        renderCartSummary();
        renderSplitButtons();

        // Hapus sesi checkout agar tidak looping
        localStorage.removeItem('pending_checkout');
      }
    }

    // Kelompokkan item keranjang berdasarkan ID Lapak
    function groupItemsBySeller() {
      sellerGroups = {};
      checkoutItems.forEach(item => {
        // Cari lapak pertama yang menjual produk ini
        const seller = sellers.find(s => s.productIds && s.productIds.includes(item.id));
        if (seller) {
          if (!sellerGroups[seller.id]) {
            sellerGroups[seller.id] = { seller: seller, items: [] };
          }
          sellerGroups[seller.id].items.push(item);
        }
      });
    }

    // Render tampilan ringkasan item dari keranjang
    function renderCartSummary() {
      const summaryDiv = document.getElementById('cart-items-summary');
      let total = 0;
      let html = '';

      // Tampilkan per lapak
      Object.keys(sellerGroups).forEach(sellerId => {
        const group = sellerGroups[sellerId];
        html += `<div style="margin-bottom:16px; padding-bottom:16px; border-bottom:1px dashed #e5e7eb;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <iconify-icon icon="solar:shop-2-bold" style="color:#0077B6;"></iconify-icon>
            <span style="font-weight:700; color:#0077B6;">${group.seller.name}</span>
          </div>`;
        
        group.items.forEach(item => {
          const subtotal = item.price * item.qty;
          total += subtotal;
          html += `<div style="display:flex; justify-content:space-between; padding:4px 0; padding-left:24px;">
            <span style="font-size:13px; color:#374151;">${item.name} x${item.qty}</span>
            <span style="font-size:13px; font-weight:600; color:#111827;">${formatRupiah(subtotal)}</span>
          </div>`;
        });
        html += `</div>`;
      });

      summaryDiv.innerHTML = html;
      
      // Update total di sidebar
      document.getElementById('order-summary').innerHTML = '';
      document.getElementById('order-total').innerHTML = `<span style="font-weight:700; color:#111827;">Total</span><span style="font-weight:800; font-size:24px; color:#0077B6;">${formatRupiah(total)}</span>`;
    }

    // Render tombol WA per lapak
    function renderSplitButtons() {
      const container = document.getElementById('split-btn-container');
      let html = '';

      Object.keys(sellerGroups).forEach(sellerId => {
        const group = sellerGroups[sellerId];
        html += `
          <button type="button" onclick="sendSplitOrder('${sellerId}')" class="btn" style="background:#25D366; color:white; padding:14px; font-size:14px; border-radius:14px; display:flex; align-items:center; justify-content:center; gap:8px; width:100%; font-weight:700; box-shadow: 0 4px 12px rgba(37,211,102,0.2);">
            <iconify-icon icon="mdi:whatsapp" style="font-size:20px;"></iconify-icon>
            Kirim ke WA ${group.seller.name}
            <span style="font-size:11px; opacity:0.8;">(${group.items.length} item)</span>
          </button>
        `;
      });

      container.innerHTML = html;
    }

    // Kirim pesan WA khusus lapak tertentu
    function sendSplitOrder(sellerId) {
      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const time = document.getElementById('order-time').value;
      const address = document.getElementById('order-address').value.trim();
      const notes = document.getElementById('order-notes').value.trim() || '-';

      if (!name || !phone || !address) {
        showToast('Lengkapi Data', 'Harap isi Nama, No HP, dan Alamat', 'warning');
        return;
      }

      const group = sellerGroups[sellerId];
      if (!group) return;

      const itemText = group.items.map(item => `- ${item.name} x${item.qty} (${item.unit})`).join('\n');
      const groupTotal = group.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

      const message = `Halo *${group.seller.name}* 👋\nSaya ingin memesan ikan dari *Pasar Ikan Waingapu*:\n\n🛒 *Detail Pesanan:*\n${itemText}\n\n💰 *Total: ${formatRupiah(groupTotal)}*\n\n⏰ *Waktu Kirim:* ${time.charAt(0).toUpperCase() + time.slice(1)}\n\n👤 *Nama:* ${name}\n📱 *No. HP:* ${phone}\n🏠 *Alamat:* ${address}\n📝 *Catatan:* ${notes}\n\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`;

      const waUrl = `https://api.whatsapp.com/send?phone=${group.seller.phone}&text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      
      showToast('Menuju WhatsApp!', `Mengirim pesanan ke ${group.seller.name}`);

      // Tandai lapak ini sudah dikirimi pesan (disable tombol)
      const buttons = document.querySelectorAll('#split-btn-container button');
      buttons.forEach(btn => {
        if (btn.textContent.includes(group.seller.name)) {
          btn.style.opacity = '0.5';
          btn.disabled = true;
          btn.innerHTML = `<iconify-icon icon="solar:check-circle-bold" style="font-size:20px;"></iconify-icon> Terkirim ke ${group.seller.name}`;
        }
      });

      // Cek apakah semua lapak sudah dikirimi pesan
      checkAllSent();
    }

    // Cek apakah semua pesanan sudah dikirim
    function checkAllSent() {
      const buttons = document.querySelectorAll('#split-btn-container button');
      const allDisabled = Array.from(buttons).every(btn => btn.disabled);
      
      if (allDisabled) {
        document.getElementById('btn-finish-checkout').style.display = 'flex';
      }
    }

    // Selesai checkout, kosongkan keranjang
    function finishSplitCheckout() {
      localStorage.removeItem('freshcatch_cart');
      updateCartBadge();
      showToast('Checkout Selesai', 'Terima kasih telah berbelanja!');
      setTimeout(() => window.location.href = 'index.html', 1000);
    }

    // =============================================
    // MODE MANUAL (Pesan 1 item langsung)
    // =============================================

    function updateOrderSummary() {
      if (checkoutMode) return;

      const fishSelect = document.getElementById('order-fish'); 
      const qtyInput = document.getElementById('order-qty');
      const summaryDiv = document.getElementById('order-summary'); 
      const totalDiv = document.getElementById('order-total');
      if (!fishSelect || !qtyInput || !summaryDiv || !totalDiv) return;

      const fishId = parseInt(fishSelect.value); 
      const qty = parseFloat(qtyInput.value) || 0;

      if (fishId && qty > 0) {
        const product = products.find(p => p.id === fishId);
        if (product) {
          const total = product.price * qty;
          summaryDiv.innerHTML = `<div style="display:flex; align-items:center; gap:12px; padding:12px; background:#e6f3fa; border-radius:16px;">
            <img src="${product.img}" alt="${product.name}" style="width:56px; height:56px; border-radius:12px; object-fit:cover;">
            <div style="flex:1; min-width:0;"><p style="font-weight:700; color:#111827; font-size:14px;">${product.name}</p><p style="font-size:12px; color:#6b7280;">${formatRupiah(product.price)}/${product.unit} × ${qty} ${product.unit}</p></div></div>`;
          totalDiv.innerHTML = `<span style="font-weight:700; color:#111827;">Total</span><span style="font-weight:800; font-size:24px; color:#0077B6;">${formatRupiah(total)}</span>`;
        }
      } else {
        summaryDiv.innerHTML = `<div style="text-align:center; padding:32px 0; color:#9ca3af;"><iconify-icon icon="solar:cart-large-2-linear" style="font-size:32px;"></iconify-icon><p style="font-size:14px; margin-top:8px;">Isi formulir untuk melihat ringkasan</p></div>`;
        totalDiv.innerHTML = `<span style="font-weight:700; color:#111827;">Total</span><span style="font-weight:800; font-size:24px; color:#0077B6;">Rp 0</span>`;
      }
    }

    // Handle submit untuk MODE MANUAL (1 item)
    function submitManualOrder(event) {
      event.preventDefault();
      if (checkoutMode) return; // Jangan jalankan ini jika mode keranjang

      const name = document.getElementById('order-name').value.trim(); 
      const phone = document.getElementById('order-phone').value.trim();
      const fishSelect = document.getElementById('order-fish');
      const fishId = fishSelect.value;
      const fishName = fishSelect.options[fishSelect.selectedIndex].text;
      const qty = document.getElementById('order-qty').value;
      const time = document.getElementById('order-time').value;
      const address = document.getElementById('order-address').value.trim();
      const notes = document.getElementById('order-notes').value.trim() || '-';

      const selectedSellerRadio = document.querySelector('input[name="selected-seller"]:checked');
      if (!selectedSellerRadio) {
        showToast('Pilih Lapak', 'Silakan pilih lapak penjual', 'warning');
        return;
      }

      const seller = sellers.find(s => s.id === parseInt(selectedSellerRadio.value));
      if (!seller) return;

      const message = `Halo *${seller.name}* 👋\nSaya ingin memesan ikan dari *Pasar Ikan Waingapu*:\n\n🛒 *Produk:* ${fishName}\n⚖️ *Jumlah:* ${qty}\n⏰ *Waktu Kirim:* ${time.charAt(0).toUpperCase() + time.slice(1)}\n\n👤 *Nama:* ${name}\n📱 *No. HP:* ${phone}\n🏠 *Alamat:* ${address}\n📝 *Catatan:* ${notes}\n\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`;

      const waUrl = `https://api.whatsapp.com/send?phone=${seller.phone}&text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      
      showToast('Menuju WhatsApp!', `Anda akan menghubungi ${seller.name}`);
      document.getElementById('order-form').reset(); 
      updateOrderSummary();
      updateSellerSelection();
    }

    // Inisialisasi
    document.addEventListener('DOMContentLoaded', () => {
      populateFishSelect();
      checkCheckoutSession();
      updateSellerSelection();

      const fishSelect = document.getElementById('order-fish'); 
      const qtyInput = document.getElementById('order-qty');
      
      if (fishSelect) {
        fishSelect.addEventListener('change', updateOrderSummary);
        fishSelect.addEventListener('change', updateSellerSelection);
      }
      if (qtyInput) qtyInput.addEventListener('input', updateOrderSummary);
      
      const form = document.getElementById('order-form'); 
      if (form) form.addEventListener('submit', submitManualOrder);
    });
