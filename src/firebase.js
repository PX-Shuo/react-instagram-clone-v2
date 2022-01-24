import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBCiE-VXWtqKMgUo2oqB3hMpsQzEA0tzYY",
  authDomain: "react-instagram-clone-5ab7e.firebaseapp.com",
  projectId: "react-instagram-clone-5ab7e",
  storageBucket: "react-instagram-clone-5ab7e.appspot.com",
  messagingSenderId: "696324142774",
  appId: "1:696324142774:web:e3f6b1a74a4c1a5bded817",
  measurementId: "G-P4GH0968VT"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }