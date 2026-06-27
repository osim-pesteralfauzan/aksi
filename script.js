// URL Aplikasi Web Google Apps Script Resmi OSIM Pester Al Fauzan
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbwtwmuHePfNiLfZA7JkR-GHyZzcv6cxIyPbR9IzyYzvS2SnutlJC7G0YUpSJ-bwj1R37A/exec";

// 1. FUNGSI OTOMATIS: Menghilangkan Loading Screen & Memunculkan Dashboard Utama
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Hilangkan loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Pastikan halaman dashboard utama muncul dan tidak kosong
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) {
            homeScreen.style.display = 'block';
        }
        
        // Sembunyikan container menu di awal
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
    }, 1500); // Tampilan muncul setelah 1.5 detik
});

// 2. FUNGSI NAVIGASI: Membuka Menu (Aspirasi / Kreasi / Recap / Announcement)
function openMenu(menuType) {
    // Sembunyikan halaman utama (dashboard)
    document.getElementById('home-screen').style.display = 'none';
    
    // Munculkan container menu utama
    document.getElementById('main-container').style.display = 'block';
    
    // Sembunyikan semua section menu terlebih dahulu agar tidak tumpang tindih
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Tampilkan bagian menu spesifik yang diklik oleh santri
    const targetMenu = document.getElementById(`menu-${menuType}`);
    if (targetMenu) {
        targetMenu.style.display = 'block';
    }
    
    window.scrollTo(0, 0);
}

// 3. FUNGSI KEMBALI: Kembali dari Menu ke Halaman Utama (Home)
function goHome() {
    // Sembunyikan container menu
    document.getElementById('main-container').style.display = 'none';
    
    // Munculkan kembali dashboard utama
    document.getElementById('home-screen').style.display = 'block';
}

// 4. FUNGSI UTAMA: Mengirim Data Formulir ke Google Sheets
function submitData(event, kategori) {
    event.preventDefault();
    const suf = kategori.toLowerCase();
    
    // Mengambil data dari input form HTML
    const nama = document.getElementById(`nama-${suf}`).value;
    const tanggal = document.getElementById(`tgl-${suf}`).value;
    const kelas = document.getElementById(`kelas-${suf}`).value;
    const isi = document.getElementById(`isi-${suf}`).value;

    const dataKirim = { kategori, nama, tanggal, kelas, isi };

    // Animasi tombol loading saat data sedang dikirim
    const btnSubmit = document.querySelector(`.btn-submit-${suf}`);
    const teksAsli = btnSubmit.innerText;
    btnSubmit.innerText = "Mengirim ke Database OSIM...";
    btnSubmit.disabled = true;

    // Proses pengiriman data online menggunakan Fetch API mode no-cors
    fetch(URL_GOOGLE_SHEET, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        alert(`Sukses! Data ${kategori} kamu sudah berhasil masuk ke database OSIM.`);
        document.getElementById(`form-${suf}`).reset();
        goHome();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan.");
    })
    .finally(() => {
        // Kembalikan tombol ke kondisi semula setelah selesai proses
        btnSubmit.innerText = teksAsli;
        btnSubmit.disabled = false;
    });
}
