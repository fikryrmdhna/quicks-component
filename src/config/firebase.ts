// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD6cgtF-_VIi8-f7N3P2atxmKVeggtDjWU',
  authDomain: 'quicks-app-fd2fb.firebaseapp.com',
  databaseURL: 'https://quicks-app-fd2fb-default-rtdb.firebaseio.com',
  projectId: 'quicks-app-fd2fb',
  storageBucket: 'quicks-app-fd2fb.firebasestorage.app',
  messagingSenderId: '318508045216',
  appId: '1:318508045216:web:f18cc7f70b82f91187cac5',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

export default app
