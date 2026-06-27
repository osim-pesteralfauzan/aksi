const adminUser = "adminaksi";
const adminPass = "santrikeren123";

let dataAKSI = JSON.parse(localStorage.getItem('dataAKSI')) || [];
let dataAnnouncement = JSON.parse(localStorage.getItem('dataAnnouncement')) || [
    { isi: "Selamat datang di Mading AKSI (Aspirasi & Kreasi Santri)!", tanggal: "2026-06-27" },
    { isi: "Ayo kirimkan karya terbaikmu di menu KREASI agar dibaca seluruh santri!", tanggal: "2026-06-27" }
];

// 1. Efek Loading Screen Menghilang
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Tampilkan home screen secara aman
            document.getElementById('home-screen').style.display = 'block';
        }, 600);
    }, 2000); 
});

// 2. Fungsi Buka Menu (Berfungsi Sempurna!)
function openMenu(menuName) {
    // Sembunyikan Home Screen
    document.getElementById('home-screen').style.display = 'none';
    
    // Tampilkan Kontainer Utama Halaman Dalam
    document.getElementById('main-container').style.display = 'block';
    
    // Sembunyikan semua konten seksi menu terlebih dahulu
    document.querySelectorAll('.menu-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Tampilkan seksi menu yang diklik
    document.getElementById(`menu-${menuName}`).style.display = 'block';

    // Logika Khusus tiap Menu
    if (menuName === 'recap') {
        renderTable('Semua');
    }
    if (menuName === 'announcement') {
        renderMading();
        startMadingScroll();
    } else {
        stopMadingScroll();
    }
}

// 3. Fungsi Kembali ke Home Dashboard
function goHome() {
    // Sembunyikan Halaman Dalam
    document.getElementById('main-container').style.display = 'none';
    
    // Munculkan kembali Dashboard Utama
    document.getElementById('home-screen').style.display = 'block';
    
    stopMadingScroll();
}

// 4. Proses Submit Data
function submitData(event, kategori) {
    event.preventDefault();
    const suf = kategori.toLowerCase();
    
    const nama = document.getElementById(`nama-${suf}`).value;
    const tanggal = document.getElementById(`tgl-${suf}`).value;
    const kelas = document.getElementById(`kelas-${suf}`).value;
    const isi = document.getElementById(`isi-${suf}`).value;

    dataAKSI.push({ kategori, nama, tanggal, kelas, isi });
    localStorage.setItem('dataAKSI', JSON.stringify(dataAKSI));

    alert(`Sukses! ${kategori} kamu sudah disalurkan.`);
    document.getElementById(`form-${suf}`).reset();
    goHome(); 
}

// 5. Tampilkan data Recap & Filter
function renderTable(filter) {
    const tbody = document.getElementById('recap-rows');
    tbody.innerHTML = '';
    let filtered = dataAKSI;
    if (filter !== 'Semua') filtered = dataAKSI.filter(i => i.kategori === filter);

    filtered.forEach(item => {
        tbody.innerHTML += `<tr>
            <td><span style="color:${item.kategori==='Aspirasi'?'#8a2be2':'#ff007f'}"><b>${item.kategori}</b></span></td>
            <td>${item.nama}</td>
            <td>${item.tanggal}</td>
            <td>${item.kelas}</td>
            <td>${item.isi}</td>
        </tr>`;
    });
}
function filterRecap(kat) { renderTable(kat); }

// Export Excel & PDF
function exportExcel() {
    const wb = XLSX.utils.table_to_book(document.getElementById('table-recap'), { sheet: "Recap" });
    XLSX.writeFile(wb, "Recap_AKSI.xlsx");
}
function exportPDF() {
    html2pdf().set({ margin: 10, filename: 'Recap_AKSI.pdf', html2canvas: { scale: 2 } })
    .from(document.getElementById('table-recap-container')).save();
}

// 6. Admin Panel Mading
function loginAdmin() {
    const u = document.getElementById('admin-user').value;
    const p = document.getElementById('admin-pass').value;
    if (u === adminUser && p === adminPass) {
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else {
        alert("Akses Ditolak! Akun Admin Salah.");
    }
}
function logoutAdmin() {
    document.getElementById('admin-login-box').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
}

function submitAnnouncement(event) {
    event.preventDefault();
    const isi = document.getElementById('isi-announcement').value;
    const tgl = new Date().toISOString().split('T')[0];
    dataAnnouncement.unshift({ isi, tanggal: tgl });
    localStorage.setItem('dataAnnouncement', JSON.stringify(dataAnnouncement));
    document.getElementById('form-announcement').reset();
    renderMading();
}

function renderMading() {
    const content = document.getElementById('mading-content');
    content.innerHTML = '';
    dataAnnouncement.forEach(i => {
        content.innerHTML += `<div class="mading-item">
            <p>📌 ${i.isi}</p>
            <small>📅 ${i.tanggal} | Admin</small>
        </div>`;
    });
}

// Auto Scroll Mading
let scrollId;
function startMadingScroll() {
    const box = document.getElementById('mading-scroll');
    const wrap = document.getElementById('mading-content');
    box.scrollTop = 0;
    clearInterval(scrollId);
    scrollId = setInterval(() => {
        if (box.scrollTop + box.clientHeight >= wrap.scrollHeight) box.scrollTop = 0;
        else box.scrollTop += 1;
    }, 30);
}
function stopMadingScroll() { clearInterval(scrollId); }