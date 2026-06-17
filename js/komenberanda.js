
    function renderHomeComments() {
      const container = document.getElementById('home-comments-list');
      if (!container) return;

      const defaultComments = [
        { name: "Budi Nelayan", text: "Webnya sangat membantu saya mempromosikan hasil tangkapan ikan di Waingapu. Luar biasa!", date: "12 Mei 2024" },
        { name: "Ibu Maria", text: "Sekarang jadi gampang mau beli ikan, tinggal cek di web dulu. Terima kasih anak muda Waingapu!", date: "15 Mei 2024" }
      ];

      const saved = localStorage.getItem('waingapu_comments');
      const comments = saved ? JSON.parse(saved) : defaultComments;

      if (comments.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#9ca3af; padding:24px; grid-column:1/-1;">Belum ada komentar. <a href="tentang.html" style="color:#0077B6; font-weight:600;">Jadilah yang pertama berkomentar!</a></p>';
        return;
      }

      container.innerHTML = comments.slice().reverse().map(c => `
        <div class="card" style="padding:20px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <div style="width:40px; height:40px; border-radius:50%; background:#e6f3fa; display:flex; align-items:center; justify-content:center; color:#0077B6; font-weight:800; font-size:16px; flex-shrink:0;">
              ${c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style="font-weight:700; font-size:14px; color:#111827;">${c.name}</h4>
              <p style="font-size:11px; color:#9ca3af;">${c.date}</p>
            </div>
          </div>
          <p style="color:#4b5563; line-height:1.6; font-size:14px; padding-left:52px;">${c.text}</p>
        </div>
      `).join('');
    }

    document.addEventListener('DOMContentLoaded', renderHomeComments);