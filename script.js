// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBFippTUHmMjLDnxC3teVgv3QoZLA7e2po",
  authDomain: "sso-authentication-d474d.firebaseapp.com",
  projectId: "sso-authentication-d474d",
};

// Initialize Firebase app + services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up
function signUp() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(userCred => {
      alert("Signed up: " + userCred.user.email);
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

// Save profile
function saveProfile() {
  const uid = auth.currentUser.uid;
  const fullName = document.getElementById("fullName").value;
  const preferredName = document.getElementById("preferredName").value;
  const pronouns = document.getElementById("pronouns").value;

  const data = {
    fullName,
    preferredName,
    pronouns,
    email: auth.currentUser.email
  };

  setDoc(doc(db, "students", uid), data)
    .then(() => alert("Profile saved!"))
    .catch(err => alert(err.message));
}

// Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("form-section").style.display = "block";

    const docSnap = await getDoc(doc(db, "students", user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("fullName").value = data.fullName || "";
      document.getElementById("preferredName").value = data.preferredName || "";
      document.getElementById("pronouns").value = data.pronouns || "";
    }
  } else {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("form-section").style.display = "none";
  }
});

// Logout
function logout() {
  signOut(auth).then(() => location.reload());
}

// Expose functions to HTML
window.login = login;
window.signUp = signUp;
window.saveProfile = saveProfile;
window.logout = logout;
