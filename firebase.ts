// Import the functions you need from the SDKs you need
import { initializeApp, setLogLevel } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTJuIoJ08vuneyAziJQOOY8H52qb2MK70",
  authDomain: "studyhub-db.firebaseapp.com",
  projectId: "studyhub-db",
  storageBucket: "studyhub-db.appspot.com",
  messagingSenderId: "219884008769",
  appId: "1:219884008769:web:39338711e6bedd6928ddc0",
  measurementId: "G-B9CRPNWXJT"
};

setLogLevel("silent");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export { app, database, storage };
