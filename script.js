// URL Aplikasi Web Google Apps Script Resmi OSIM Pester Al Fauzan
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

// Fungsi Utama Mengirim Data ke Google Sheets
function submitData(event, kategori) {
    event.preventDefault();
    const suf = kategori.toLowerCase();
    
    const nama = document.getElementById(`nama-${suf}`).value;
    const tanggal = document.getElementById(`tgl-${suf}`).value;
    const kelas = document.getElementById(`kelas-${suf}`).value;
    const isi = document.getElementById(`isi-${suf}`).value;

    // Menyiapkan data berbentuk objek JSON sesuai kolom Spreadsheet [cite: 1, 2]
    const dataKirim = { kategori, nama, tanggal, kelas, isi };

    // Animasi tombol loading agar santri tahu data sedang diproses
    const btnSubmit = document.querySelector(`.btn-submit-${suf}`);
    const teksAsli = btnSubmit.innerText;
    btnSubmit.innerText = "Mengirim ke Database OSIM...";
    btnSubmit.disabled = true;

    // Proses pengiriman data online menggunakan Fetch API
    fetch(URL_GOOGLE_SHEET, {
        method: "POST",
        body: JSON.stringify(dataKirim)
    })
    .then(response => response.json())
    .then(hasil => {
        if(hasil.result === "success") {
            alert(`Sukses! ${kategori} kamu sudah berhasil masuk ke database OSIM.`);
            document.getElementById(`form-${suf}`).reset();
            goHome();
        } else {
            alert("Gagal mengirim data: " + hasil.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan jaringan. Pastikan setingan Apps Script sudah diatur ke 'Anyone'.");
    })
    .finally(() => {
        // Mengembalikan tombol ke kondisi semula setelah selesai
        btnSubmit.innerText = teksAsli;
        btnSubmit.disabled = false;
    });
}