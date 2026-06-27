// URL Aplikasi Web Google Apps Script Resmi OSIM Pester Al Fauzan
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbwtwmuHePfNiLfZA7JkR-GHyZzcv6cxIyPbR9IzyYzvS2SnutlJC7G0YUpSJ-bwj1R37A/exec";

// 1. FUNGSI OTOMATIS: Menghilangkan Loading Screen saat Web Selesai Dimuat
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500); // Loading screen akan hilang otomatis setelah 1.5 detik
});

// 2. FUNGSI NAVIGASI: Membuka Menu Sesuai dengan ID di index.html
function openMenu(menuType) {
    // Sembunyikan halaman utama
    document.getElementById('home-screen').style.display = 'none';
    
    // Munculkan container utama tempat menu berada
    document.getElementById('main-container').style.display = 'block';
    
    // Sembunyikan semua section menu terlebih dahulu agar tidak menumpuk
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Tampilkan menu spesifik yang dipilih (aspirasi, kreasi, recap, atau announcement)
    const targetMenu = document.getElementById(`menu-${menuType}`);
    if (targetMenu) {
        targetMenu.style.display = 'block';
    }
    
    window.scrollTo(0, 0);
}

// 3. FUNGSI KEMBALI: Kembali ke Tampilan Utama (Home)
function goHome() {
    // Sembunyikan container menu
    document.getElementById('main-container').style.display = 'none';
    
    // Munculkan kembali dashboard utama
    document.getElementById('home-screen').style.display = 'block';
}

// 4. FUNGSI UTAMA: Mengirim Data ke Google Sheets
function submitData(event, kategori) {
    event.preventDefault();
    const suf = kategori.toLowerCase();
    
    // Mengambil nilai input dari form di index.html
    const nama = document.getElementById(`nama-${suf}`).value;
    const tanggal = document.getElementById(`tgl-${suf}`).value;
    const kelas = document.getElementById(`kelas-${suf}`).value;
    const isi = document.getElementById(`isi-${suf}`).value;

    // Menyiapkan data berbentuk objek JSON sesuai kolom Spreadsheet
    const dataKirim = { kategori, nama, tanggal, kelas, isi };

    // Animasi tombol loading berdasarkan class tombol di HTML
    const btnSubmit = document.querySelector(`.btn-submit-${suf}`);
    const teksAsli = btnSubmit.innerText;
    btnSubmit.innerText = "Mengirim ke Database OSIM...";
    btnSubmit.disabled = true;

    // Proses pengiriman data online menggunakan Fetch API dengan mode no-cors agar anti-stuck
    fetch(URL_GOOGLE_SHEET, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        // Mode no-cors akan langsung mengeksekusi aksi sukses ini setelah data terlempar
        alert(`Sukses! Data ${kategori} kamu sudah berhasil masuk ke database OSIM.`);
        document.getElementById(`form-${suf}`).reset();
        goHome();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan.");
    })
    .finally(() => {
        // Mengembalikan tombol ke kondisi semula setelah selesai
        btnSubmit.innerText = teksAsli;
        btnSubmit.disabled = false;
    });
}
