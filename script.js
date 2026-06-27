// URL Aplikasi Web Google Apps Script Resmi
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbwtwmuHePfNiLfZA7JkR-GHyZzcv6cxIyPbR9IzyYzvS2SnutlJC7G0YUpSJ-bwj1R37A/exec";

// Fungsi Navigasi Halaman
function showPage(pageId) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('aspirasi-page').classList.add('hidden');
    document.getElementById('kreasi-page').classList.add('hidden');
    
    document.getElementById(pageId).classList.remove('hidden');
    window.scrollTo(0, 0);
}

function goHome() {
    showPage('home-page');
}

// Fungsi Utama Mengirim Data ke Google Sheets (Anti-Stuck / No-CORS Mode)
function submitData(event, kategori) {
    event.preventDefault();
    const suf = kategori.toLowerCase();
    
    const nama = document.getElementById(`nama-${suf}`).value;
    const tanggal = document.getElementById(`tgl-${suf}`).value;
    const kelas = document.getElementById(`kelas-${suf}`).value;
    const isi = document.getElementById(`isi-${suf}`).value;

    const dataKirim = { kategori, nama, tanggal, kelas, isi };

    // Animasi tombol loading
    const btnSubmit = document.querySelector(`.btn-submit-${suf}`);
    const teksAsli = btnSubmit.innerText;
    btnSubmit.innerText = "Mengirim ke Database OSIM...";
    btnSubmit.disabled = true;

    // Trik "no-cors" agar browser tidak memblokir atau membuat web stuck loading lama
    fetch(URL_GOOGLE_SHEET, {
        method: "POST",
        mode: "no-cors", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        // Karena pakai mode no-cors, browser akan langsung menganggap sukses tanpa menunggu balasan Google
        alert(`Sukses! Data ${kategori} kamu sedang diproses masuk ke database OSIM.`);
        document.getElementById(`form-${suf}`).reset();
        goHome();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan.");
    })
    .finally(() => {
        btnSubmit.innerText = teksAsli;
        btnSubmit.disabled = false;
    });
}
