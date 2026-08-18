# KCHAT Admin — GitHub Pages

Versi ini sudah memakai konfigurasi Firebase yang kamu kirim dan siap di-upload ke GitHub Pages.

## Satu hal yang tetap wajib dilakukan
Buat akun admin di Firebase Authentication (Email/Password) dengan email internal panel dan password admin yang kamu tetapkan sebelumnya. Email internal tidak ditampilkan di panel login.

Di Firebase Console: Authentication → Sign-in method → Email/Password → Enable → Users → Add user.

Realtime Database Rules harus membatasi akses hanya UID admin.
