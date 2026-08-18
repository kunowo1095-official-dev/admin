# KCHAT Admin — GitHub Pages Edition (Firebase)

Panel ini **sepenuhnya statis** dan cocok untuk GitHub Pages. Tidak membutuhkan Flask, Node, VPS, atau server custom.

## Kenapa sebelumnya muncul `auth/api-key-not-valid`?
Karena file `firebase-config.js` versi sebelumnya masih memakai placeholder seperti `PASTE_WEB_API_KEY`.

## Setup wajib satu kali
1. Buka Firebase Console → project `chat-place-kunowo`.
2. Project settings → General → Your apps → pilih/daftarkan **Web app**.
3. Salin **Firebase SDK config**.
4. Isi `firebase-config.js`:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Firebase Authentication → Sign-in method → aktifkan **Email/Password**.
6. Buat user admin Authentication:
   - Email: `kunowo10958088@kchatadmin.local`
   - Password: `KNW10958088`
7. Realtime Database Rules: izinkan hanya UID admin.

Contoh rules:
```json
{
  "rules": {
    "users": {
      ".read": "auth != null && auth.uid === 'ADMIN_UID'",
      ".write": "auth != null && auth.uid === 'ADMIN_UID'"
    },
    "adminLogs": {
      ".read": "auth != null && auth.uid === 'ADMIN_UID'",
      ".write": "auth != null && auth.uid === 'ADMIN_UID'"
    }
  }
}
```

## GitHub Pages
Upload seluruh isi folder ini ke repository, lalu aktifkan GitHub Pages dari branch utama.

## Keamanan
- Firebase Web API key boleh terlihat di frontend; itu bukan secret credential.
- Jangan pernah menaruh Service Account JSON, private key, atau database secret di repository.
- Password admin digunakan oleh Firebase Authentication, bukan disimpan sebagai password hardcoded di JavaScript.
- Pastikan Firebase Rules membatasi database berdasarkan `auth.uid` admin.
