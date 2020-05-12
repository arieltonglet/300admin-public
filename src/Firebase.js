import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: 'xxxxx',
  authDomain: 'xxxxx',
  databaseURL: 'xxxxx',
  projectId: 'xxxxx',
  storageBucket: 'xxxxx',
  messagingSenderId: 'xxxxx',
  appId: 'xxxxx',
  measurementId: 'xxxxx',
}

firebase.initializeApp(config)

// Shortcuts
const db = firebase.firestore()
const firebaseAuth = firebase.auth()
const clientsRef = db.collection('xxxxx')
const worksRef = db.collection('xxxxx')

export { clientsRef, db, firebaseAuth, worksRef }
