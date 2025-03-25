// Firebase SDKs - modular import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Config for your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBFippTUHmMjLDnxC3teVgv3QoZLA7e2po",
  authDomain: "sso-authentication-d474d.firebaseapp.com",
  projectId: "sso-authentication-d474d",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up
function signUp() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(userCred => {
      alert("Signed up as: " + userCred.user.email);
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(userCred => {
      alert("Logged in as: " + userCred.user.email);
    })
    .catch(err => alert(err.message));
}

// Save Profile
function saveProfile() {
  const uid = auth.currentUser.uid;
  const data = {
    fullName: document.getElementById("fullName").value,
    preferredName: document.getElementById("preferredName").value,
    pronouns: document.getElementById("pronouns").value,
    email: auth.currentUser.email
  };

  setDoc(doc(db, "students", uid), data)
    .then(() => {
      alert("Profile saved!");
      loadDirectory();
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  signOut(auth).then(() => {
    location.reload();
  });
}

// Load all students into the directory
function loadDirectory() {
  const dir = document.getElementById("directory");
  dir.innerHTML = "";

  getDocs(collection(db, "students")).then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();
      dir.innerHTML += `<div><strong>${d.preferredName}</strong> (${d.fullName}) – ${d.pronouns}</div>`;
    });
  });
}

// Track auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("form-section").style.display = "block";

    // Load their profile
    const snap = await getDoc(doc(db, "students", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("fullName").value = data.fullName || "";
      document.getElementById("preferredName").value = data.preferredName || "";
      document.getElementById("pronouns").value = data.pronouns || "";
    }

    loadDirectory();
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("form-section").style.display = "none";
  }
});

// Make functions accessible to HTML
window.login = login;
window.signUp = signUp;
window.saveProfile = saveProfile;
window.logout = logout;
