   // Komentar bawaan (Contoh)
        const defaultComments = [
            { name: "Budi Nelayan", text: "Webnya sangat membantu saya mempromosikan hasil tangkapan ikan di Waingapu. Luar biasa!", date: "12 Mei 2024" },
            { name: "Ibu Maria", text: "Sekarang jadi gampang mau beli ikan, tinggal cek di web dulu. Terima kasih anak muda Waingapu!", date: "15 Mei 2024" }
        ];

        // Ambil komentar dari localStorage atau gunakan default
        function getComments() {
            const saved = localStorage.getItem('waingapu_comments');
            return saved ? JSON.parse(saved) : defaultComments;
        }

        // Simpan komentar ke localStorage
        function saveComments(comments) {
            localStorage.setItem('waingapu_comments', JSON.stringify(comments));
        }

        // Tampilkan komentar ke layar
        function renderComments() {
            const container = document.getElementById('comments-list');
            if (!container) return;

            const comments = getComments();

            if (comments.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#9ca3af; padding:24px;">Belum ada komentar. Jadilah yang pertama berkomentar!</p>';
                return;
            }

            // Reverse agar komentar terbaru di atas
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

        // Handle submit form
        function submitComment(event) {
            event.preventDefault();
            const nameInput = document.getElementById('comment-name');
            const textInput = document.getElementById('comment-text');

            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name || !text) {
                showToast('Perhatian', 'Harap isi nama dan komentar Anda', 'warning');
                return;
            }

            const comments = getComments();
            const today = new Date();
            const dateStr = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

            // Tambahkan komentar baru
            comments.push({ name: name, text: text, date: dateStr });
            saveComments(comments);

            // Kosongkan form
            nameInput.value = '';
            textInput.value = '';

            // Render ulang daftar komentar
            renderComments();

            // Notifikasi sukses (memakai fungsi toast dari app.js)
            showToast('Terima Kasih!', 'Komentar Anda berhasil dikirim');
        }

        // Inisialisasi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', () => {
            renderComments();
            const form = document.getElementById('comment-form');
            if (form) form.addEventListener('submit', submitComment);
        });
