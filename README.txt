BOHEE OFFICIAL WEBSITE — STARTER PACKAGE

FILES
- index.html: public website
- style.css: design and responsive layout
- script.js: intro, theme switch, QR popup, search and voice search
- admin.html / admin.js: Firebase-based admin login starter
- images/: add your images here

IMAGE NAMES (exact spelling)
images/Boheeintropic.png
images/boheebanner.png
images/night-bg.jpg
images/day-bg.jpg
images/paytm-qr.png
images/profile.png
images/song-cover-1.jpg
images/song-cover-2.jpg
images/gallery-1.jpg
images/gallery-2.jpg
images/gallery-3.jpg

IMPORTANT
1. Put your pictures in the images folder using the exact names above.
2. The QR popup is ready in the page layout; add your real Paytm QR as images/paytm-qr.png.
3. Signature sparkle audio is generated in the browser using Web Audio after Enter is clicked. It does not need a separate MP3.
4. Admin login will NOT work until you create a Firebase project, enable Email/Password Authentication, create your admin user, add your Firebase web config in admin.js, and configure Firestore + Storage security rules.
5. The current website ON/OFF switch is a starter implementation. A truly global public OFF switch needs the public website to read the Firestore status document. This must be added together with Firebase configuration before publishing.
6. Do not put Firebase service-account credentials or private keys in these files.
7. Social auto-publishing to Instagram/Facebook/YouTube needs separate official API/OAuth setup and a secure server/backend; it is not enabled in this starter package.
8. This package is a clean first build, not the complete cloud-connected admin system. Do not claim the unfinished Firebase-dependent features are live.

GITHUB PAGES
Upload the contents of this folder to the root of your GitHub Pages repository. Keep index.html, style.css and script.js together. Keep admin.html and admin.js together in the same root. Keep images in the images folder.
