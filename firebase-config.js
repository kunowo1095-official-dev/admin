// Firebase Web config boleh ada di frontend.
// KEAMANAN SEBENARNYA DITENTUKAN OLEH Firebase Authentication + Realtime Database Rules.
export const firebaseConfig = {
  apiKey: "PASTE_WEB_API_KEY",
  authDomain: "chat-place-kunowo.firebaseapp.com",
  databaseURL: "https://chat-place-kunowo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-place-kunowo",
  storageBucket: "chat-place-kunowo.firebasestorage.app",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// Email internal untuk akun admin Firebase Authentication.
// Password TIDAK disimpan di file ini.
export const ADMIN_USERNAME = "KUNOWO10958088";
export const ADMIN_AUTH_EMAIL = "kunowo10958088@kchatadmin.local";
