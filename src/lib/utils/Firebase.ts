import { initializeApp, FirebaseError } from 'firebase/app'
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail as firebaseAuthSendPasswordResetEmail,
  signOut as firebaseAuthSignOut, sendEmailVerification
} from 'firebase/auth'
import {
  getFirestore, collection, doc, setDoc, updateDoc, getDoc
} from 'firebase/firestore'
import {
  PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public'
import type { ApiWheelMeta } from '$lib/utils/Api'

interface DbDate {
  _seconds: number
  _nanoseconds: number
}

export interface DbWheelMeta extends Omit<ApiWheelMeta, 'created' | 'updated'> {
  created: DbDate,
  updated: DbDate | null
}

interface DbUser {
  createdAt: Date
  lastActive: Date
  uid: string
  email: string
  wheels: string[]
}

export const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
}

try {
  initializeApp(firebaseConfig)
} catch (error) {
  if (error instanceof FirebaseError && error.code !== 'app/duplicate-app') {
    console.error(error)
  }
}

const db = getFirestore()
const auth = getAuth()

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth, email, password
  )
  await setDoc(doc(collection(db, 'users'), userCredential.user.uid), {
    email,
    createdAt: new Date(),
    lastActive: new Date(),
    uid: userCredential.user.uid,
    wheels: []
  })
  return userCredential.user
}

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth, email, password
  )
  updateUserLastActive(userCredential.user.uid)
  return userCredential.user
}

export const updateUserLastActive = (uid: string) => (
  updateDoc(doc(db, 'users', uid), { lastActive: new Date() })
)

export const sendPasswordResetEmail = (email: string) => (
  firebaseAuthSendPasswordResetEmail(auth, email)
)

export const sendEmailVerificationEmail = () => {
  if (auth.currentUser) sendEmailVerification(auth.currentUser)
}

export const signOut = () => firebaseAuthSignOut(auth)

export const getCurrentUser = () => auth.currentUser

export const getSelfFromDb = async () => {
  if (!auth.currentUser) return null
  const userSnapshot = await getDoc(doc(db, 'users', auth.currentUser.uid))
  if (!userSnapshot.exists()) return null
  return userSnapshot.data() as DbUser
}
