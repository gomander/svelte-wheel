import { initializeApp } from 'firebase/app'
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from 'firebase/auth'
import {
  FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '$env/static/private'

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth, email, password
  )
  return userCredential.user
}

export const signInUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth, email, password
  )
  return userCredential.user
}

export const signOutUser = async () => await auth.signOut()

export const getCurrentUser = () => auth.currentUser
