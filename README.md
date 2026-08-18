# KCHAT Admin — GitHub Pages

Firebase config sudah tertanam. Tidak perlu mengedit `firebase-config.js`.

### Satu kali setup di Firebase
1. Firebase Console → Authentication → Sign-in method → Email/Password → Enable.
2. Authentication → Users → Add user.
3. Buat user dengan email internal panel yang sudah tertanam di config dan password admin yang kamu pilih.

Setelah user Firebase dibuat, upload folder ini ke GitHub Pages. Login di panel hanya meminta username/password admin; email internal tidak ditampilkan.

> Jangan menaruh Firebase Admin SDK/private key di frontend/GitHub Pages. Gunakan Firebase Security Rules untuk membatasi `users` dan `adminLogs` ke UID admin.
