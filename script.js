// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFippTUHmMjLDnxC3teVgv3QoZLA7e2po",
  authDomain: "sso-authentication-d474d.firebaseapp.com",
  projectId: "sso-authentication-d474d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Example login function
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(userCred => alert("Logged in as " + userCred.user.email))
    .catch(err => alert(err.message));
}

window.login = login;
window.signUp = signUp;
window.saveProfile = saveProfile;
