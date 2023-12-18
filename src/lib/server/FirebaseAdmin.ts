import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { firebaseConfig } from '$lib/utils/Firebase'

const app = initializeApp(firebaseConfig)

const firestore = getFirestore(app)
