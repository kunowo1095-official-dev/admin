# KCHAT Admin

Versi ini **tidak memakai Firebase Authentication**. Login admin dilakukan lokal di browser menggunakan username/password yang ada di `firebase-config.js`. Firebase hanya dipakai sebagai Realtime Database.

## Login default
- Username: `KUNOWO10958088`
- Password: `KUNOWO10958088`

Ganti `ADMIN_PASSWORD` sebelum dipublikasikan.

## Catatan keamanan
Karena tidak ada Firebase Auth, kredensial admin pada GitHub Pages secara teknis bisa ditemukan dari source JavaScript. Ini cocok untuk panel pribadi/testing, bukan panel publik yang membutuhkan keamanan kuat.

Selain itu, Firebase Realtime Database rules harus mengizinkan operasi yang dipakai panel; tanpa autentikasi, jangan membuka database secara luas untuk aplikasi produksi.
