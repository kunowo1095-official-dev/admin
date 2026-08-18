# KCHAT Admin — GitHub Pages Edition

Frontend static-only. Tidak membutuhkan Flask/Node/backend custom.

## 1. Firebase Web App
1. Buka Firebase Console → Project `chat-place-kunowo`.
2. Tambahkan Web App dan salin config ke `firebase-config.js`.
3. Aktifkan Authentication → Sign-in method → Email/Password.
4. Buat 1 user admin dengan:
   - Email: `kunowo10958088@kchatadmin.local`
   - Password: `KNW10958088`
5. Catat UID user admin tersebut.

## 2. Realtime Database Rules
Gunakan rules yang hanya mengizinkan UID admin membaca/menulis panel. Ganti `ADMIN_UID` dengan UID tadi.

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

Jangan memakai rule `.read: true` / `.write: true`.

## 3. GitHub Pages
Upload semua file ke repo GitHub, lalu Settings → Pages → Deploy from branch.

File yang wajib ada:
- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`

## 4. Catatan keamanan
- GitHub Pages bersifat publik; HTML/CSS/JS frontend selalu dapat dilihat.
- Firebase Web API key bukan secret.
- Jangan pernah memasukkan Firebase Admin SDK private key, database secret, atau service-account JSON ke repo.
- Username/password admin tidak ditaruh sebagai password hardcoded di JavaScript.
- Password akun pengguna pada schema `users/{username}` masih mengikuti schema aplikasi lama. Untuk keamanan lebih baik, migrasikan login pengguna ke Firebase Authentication.
