// Firebase is required for secure admin login and cloud uploads.
// Add your Firebase web-app config below. Never add service-account/private keys here.
const firebaseConfig = {
  apiKey: "ADD_FIREBASE_WEB_API_KEY",
  authDomain: "ADD_PROJECT.firebaseapp.com",
  projectId: "ADD_PROJECT_ID",
  storageBucket: "ADD_PROJECT.appspot.com",
  messagingSenderId: "ADD_SENDER_ID",
  appId: "ADD_APP_ID"
};
const msg=document.getElementById("adminMessage");
const show=(s)=>{if(msg)msg.textContent=s;};
const configReady=!firebaseConfig.apiKey.startsWith("ADD_");
if(!configReady){
  show("Firebase setup required before admin login can work. Follow README.txt.");
}else{
  import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js").then(async appMod=>{
    const authMod=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
    const dbMod=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const storageMod=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js");
    const app=appMod.initializeApp(firebaseConfig);
    const auth=authMod.getAuth(app), db=dbMod.getFirestore(app), storage=storageMod.getStorage(app);
    const login=document.getElementById("loginPanel"), dash=document.getElementById("dashboard");
    authMod.onAuthStateChanged(auth,user=>{
      login.classList.toggle("hidden",!!user);dash.classList.toggle("hidden",!user);
      if(user) loadStatus();
    });
    document.getElementById("loginBtn").onclick=async()=>{
      try{await authMod.signInWithEmailAndPassword(auth,document.getElementById("adminEmail").value,document.getElementById("adminPassword").value);show("Signed in.");}
      catch(e){show("Login failed. Check email/password and Firebase authorised admin account.");}
    };
    document.getElementById("logoutBtn").onclick=()=>authMod.signOut(auth);
    async function loadStatus(){
      try{const snap=await dbMod.getDoc(dbMod.doc(db,"site","status"));document.getElementById("siteEnabled").checked=snap.exists()?snap.data().enabled!==false:true;}
      catch(e){show("Could not read website status. Check Firestore Rules.");}
    }
    document.getElementById("saveSettings").onclick=async()=>{
      try{await dbMod.setDoc(dbMod.doc(db,"site","status"),{enabled:document.getElementById("siteEnabled").checked,updatedAt:Date.now()});show("Website status saved.");}
      catch(e){show("Save failed. Check admin Firestore permissions.");}
    };
    document.getElementById("uploadQr").onclick=async()=>{
      const file=document.getElementById("qrUpload").files[0];if(!file){show("Choose your Paytm QR picture first.");return;}
      try{const ref=storageMod.ref(storage,"public/paytm-qr.png");await storageMod.uploadBytes(ref,file);const url=await storageMod.getDownloadURL(ref);await dbMod.setDoc(dbMod.doc(db,"site","assets"),{paytmQr:url},{merge:true});show("QR uploaded. Connect this URL to the public QR popup in the next setup step.");}
      catch(e){show("Upload failed. Check Firebase Storage Rules and billing/plan limits.");}
    };
  }).catch(()=>show("Firebase SDK could not load. Check internet connection."));
}
