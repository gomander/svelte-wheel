import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { FirebaseError } from 'firebase/app'
import { firebaseConfig } from '$lib/utils/Firebase'
import type {
  ApiUser, ApiWheel, ApiWheelMeta, WheelVisibility
} from '$lib/utils/Api'

try {
  initializeApp(firebaseConfig)
} catch (error) {
  if (error instanceof FirebaseError && error.code !== 'app/duplicate-app') {
    console.error(error)
  }
}

const db = getFirestore()

export const getWheel = async (path: string, uid?: string | null) => {
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

export const getUserWheelsMeta = async (uid: string) => {
  const userSnap = await db.doc(`users/${uid}`).get()
  if (!userSnap.exists) {
    return []
  }
  const user = userSnap.data() as ApiUser
  return await getWheelMetaForPaths(user.wheels)
}

export const getWheelMetaForPaths = async (paths: string[]) => {
  const metaSnaps = await db.getAll(
    ...paths.map(path => db.doc(`wheel-meta/${path}`))
  )
  return metaSnaps.map(snap => snap.data() as ApiWheelMeta)
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

export const updateWheel = async (
  path: string,
  wheel: Partial<Omit<ApiWheel, 'path'>>,
  uid: string,
  visibility?: WheelVisibility
) => {
  const wheelMetaDoc = db.doc(`wheel-meta/${path}`)
  const wheelMetaSnap = await wheelMetaDoc.get()
  if (!wheelMetaSnap.exists) {
    return null
  }
  const wheelMeta = wheelMetaSnap.data() as ApiWheelMeta
  if (wheelMeta.uid !== uid) {
    return null
  }
  const newWheelMeta: Partial<ApiWheelMeta> = {
    updated: Date.now()
  }
  if (wheel.config && wheel.config.title !== wheelMeta.title) {
    newWheelMeta.title = wheel.config.title
  }
  if (visibility) {
    newWheelMeta.visibility = visibility
  }
  await wheelMetaDoc.update(newWheelMeta)
  const wheelDoc = db.doc(`wheels/${path}`)
  await wheelDoc.update({ ...wheel } satisfies Partial<ApiWheel>)
  return wheelMeta.path
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
