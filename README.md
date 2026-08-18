# KCHAT Admin — GitHub Pages

Firebase configuration is already embedded. No code/config editing is required.

## One-time Firebase setup

This panel uses Firebase Authentication with Email/Password, so the provider must be enabled in the Firebase project. Firebase documents that Email/Password must be enabled before signing in with `signInWithEmailAndPassword`.

1. Firebase Console → **Authentication** → **Sign-in method**.
2. Enable **Email/Password** and save.
3. Open **Authentication → Users**.
4. Create the single admin authentication user used internally by this panel:
   - Email: `kunowo10958088@kchatadmin.local`
   - Password: use the admin password configured for this panel.
5. Upload this folder to GitHub Pages.

The login page only displays Username + Password. The internal email is not displayed.

## Important security note

GitHub Pages is static hosting. Never put a Firebase Admin SDK private key, service-account JSON, or database master credential in this repository.

Protect the Realtime Database with Firebase Security Rules so only the authenticated admin UID can modify `users` and `adminLogs`.
