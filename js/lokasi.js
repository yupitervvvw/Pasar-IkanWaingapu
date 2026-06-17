/* ============================================
   LOKASI.JS - Script Halaman Lokasi Pasar
   ============================================ */

// 1. Ganti dengan FULL LINK dari "Sematkan peta" (Embed a map)
const mapLocations = [
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125871.05446656009!2d120.07834483906251!3d-9.640782151078993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c4c9bae647ee2c5%3A0x5b07015af74c0c27!2sPasar%20Ikan%20Segar%20WGP!5e0!3m2!1sen!2sid!4v1781656193421!5m2!1sen!2sid' ,
'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125856.7136986234!2d120.17658684335939!3d-9.679135099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c4c890000000001%3A0x277857154dcf4b40!2sPasar%20Ikan%20Jembatan%20Kawangu!5e0!3m2!1sen!2sid!4v1781656308946!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
];

// Warna border aktif untuk masing-masing kartu lokasi
const activeColors = ['#0077B6', '#2ECC71'];

function selectLocation(index) {
  // 1. Highlight kartu yang dipilih
  const cards = document.querySelectorAll('.location-card');
  cards.forEach((card, i) => {
    if (i === index) {
      card.style.borderColor = activeColors[i];
      card.style.borderWidth = '2px';
      card.style.boxShadow = `0 8px 24px ${activeColors[i]}1F`; 
    } else {
      card.style.borderColor = 'transparent';
      card.style.borderWidth = '2px'; 
      card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
    }
  });

  // 2. Ganti src iframe Google Maps
  const mapIframe = document.getElementById('google-maps-frame');
  if (mapIframe && mapLocations[index]) {
    // PERHATIKAN: Kita langsung memakai linknya, tanpa https://maps.google.com/maps?q=
    mapIframe.src = mapLocations[index]; 
  }

  // 3. Scroll ke peta agar pengguna bisa melihat perubahan map
  const mapSection = document.getElementById('map-container');
  if(mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });

  // 4. Toast notifikasi
  const name = cards[index]?.querySelector('.location-name')?.textContent || '';
  showToast('Lokasi Dipilih', name);
}