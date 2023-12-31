import { initializeApp, getApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { firebaseConfig } from '$lib/utils/Firebase'
import type {
  ApiUser, ApiWheel, ApiWheelMeta, WheelVisibility
} from '$lib/utils/Api'
import { ENVIRONMENT } from '$env/static/private'

const app = (getApps().length && ENVIRONMENT === 'dev')
  ? getApp()
  : initializeApp(firebaseConfig)
const db = getFirestore(app)

export const getWheel = async (path: string, uid?: string) => {
  const metaSnap = await db.doc(`wheel-meta/${path}`).get()
  if (!metaSnap.exists) {
    return null
  }
  const meta = metaSnap.data() as ApiWheelMeta
  if (meta.visibility === 'private' && meta.uid !== uid) {
    return null
  }
  const wheelSnap = await db.doc(`wheels/${path}`).get()
  if (wheelSnap.exists) {
    return wheelSnap.data() as ApiWheel
  }
  return null
}

export const getWheels = async (uid: string) => {
  const metaSnap = await db.collection('wheel-meta').where(
    'uid', '==', uid
  ).get()
  const paths = metaSnap.docs.map(doc => (doc.data() as ApiWheelMeta).path)
  const wheelSnaps = await db.getAll(
    ...paths.map(path => db.doc(`wheels/${path}`))
  )
  return wheelSnaps.map(snap => snap.data() as ApiWheel)
}

export const saveWheel = async (
  wheel: Omit<ApiWheel, 'path'>, uid: string, visibility: WheelVisibility
) => {
  const path = await getNewWheelPath()
  await db.collection('wheel-meta').doc(path).create({
    path,
    uid,
    visibility,
    created: Date.now(),
    updated: null,
    title: wheel.config.title,
    views: 0
  } satisfies ApiWheelMeta)
  await db.collection('wheels').doc(path).create(
    { path, ...wheel } satisfies ApiWheel
  )
  const userDoc = await db.doc(`users/${uid}`).get()
  const user = userDoc.data() as ApiUser
  await db.doc(`users/${uid}`).update({
    wheels: [...user?.wheels, path]
  } satisfies Partial<ApiUser>)
  return path
}

const getNewWheelPath = async () => {
  let path: string
  let snap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  do {
    path = getRandomPath()
    snap = await db.doc(`wheel-meta/${path}`).get()
  } while (snap.exists)
  return path
}

const getRandomPath = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]
  ).toSpliced(3, 0, '-').join('')
}
