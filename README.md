# Sidokerto Village Connect

Saya sedang mengerjakan tugas KKN membuat *Sistem Informasi Desa Terpadu* untuk *Desa Sidokerto, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur*. Ini bukan sekadar landing page statis — tapi sistem informasi desa dengan data dari database, siap dipakai perangkat desa untuk mengelola konten.



*Catatan penting soal data (harus dipatuhi):*

Informasi publik yang benar-benar terverifikasi soal Sidokerto Buduran masih terbatas. Yang sudah terkonfirmasi lewat sumber resmi (website desa & dokumen APBDes 2026):

•⁠ ⁠Nama & lokasi: Desa Sidokerto, Kecamatan Buduran, Kabupaten Sidoarjo — benar dan terverifikasi.

•⁠ ⁠Ada Makam Aulia Sono di Dusun Sono (kompleks ziarah lima makam ulama, termasuk pendiri Ponpes Sono KH. Muhayyin) — ini tervalidasi dari pemberitaan media lokal.



*STRUKTUR HALAMAN WEBSITE (FRONTEND)*



*1. Halaman Beranda (Home)*

• *Hero Section:* Tagline yang tegas dan langsung memperjelas identitas wilayah: *Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo, Jawa Timur*, sehingga tidak terjadi kesalahan lokasi dengan daerah Sidokerto di Jombang.

• *Peta Wilayah & Ringkasan:* Menampilkan peta lokasi kantor desa serta statistik dasar wilayah, seperti jumlah dusun, RT, dan RW.

• *Highlight Destinasi:* Kartu/banner visual yang mengarahkan pengguna ke fitur unggulan, yaitu *Jelajah Religi Makam Aulia Sono*.



*2. Halaman Jelajah Religi & Pusaka Sidokerto (Fitur Unggulan Utama)*

• *Pusat Sejarah & Ziarah:* Menyajikan narasi lengkap dan tervalidasi mengenai *Kompleks Makam Aulia Sono (Dusun Sono)* serta jejak sejarah *KH. Muhayyin*.

• *Panduan & Peta Akses:* Menyediakan informasi rute dan akses bagi peziarah maupun pendatang dari luar kota agar lebih mudah menemukan kawasan makam.

• *Galeri Foto/Arsip:* Menampilkan dokumentasi foto dan arsip terkait kawasan bersejarah tersebut.



*3. Halaman Profil & Pemerintahan Desa*

• *Profil & Visi-Misi:* Menampilkan sejarah singkat terbentuknya Desa Sidokerto beserta visi dan misi desa.

• *Struktur Perangkat Desa:* Menampilkan foto, nama, dan jabatan perangkat desa, seperti Kepala Desa, Sekretaris Desa, dan perangkat lainnya. Data diambil dari database dan dapat dikelola atau diperbarui oleh admin.



*4. Halaman Kontak & Layanan Informasi*

• Menampilkan alamat kantor desa, jam operasional, nomor telepon/email resmi.

• *Google Maps:* Menyediakan embed Google Maps lokasi kantor desa untuk memudahkan warga dalam keperluan administratif maupun kunjungan langsung.



•⁠ ⁠*Backend:* Laravel (versi terbaru stabil)

•⁠ ⁠*Database:* MySQL

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sidokerto-village-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f89894a0-2d96-47de-a56a-be6511bd0d43).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
