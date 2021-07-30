import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCMM6KLLC1O4Jy4_6XccCEVsdPhRoicuVk",
  authDomain: "invoice-app-d9977.firebaseapp.com",
  projectId: "invoice-app-d9977",
  storageBucket: "invoice-app-d9977.appspot.com",
  messagingSenderId: "401247273880",
  appId: "1:401247273880:web:00f79edbb8c4d9038a61ed",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();
