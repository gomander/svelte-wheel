import { initializeApp, getApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { firebaseConfig } from '$lib/utils/Firebase'
import type { ApiWheel, ApiWheelMeta, WheelVisibility } from '$lib/types/api'

const app = getApps().length
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

export const saveWheel = async (
  wheel: Omit<ApiWheel, 'path'>, uid: string, visibility: WheelVisibility
) => {
  const path = await getNewWheelPath()
  await db.collection('wheel-meta').doc(path).create(
    {
      path,
      uid,
      visibility,
      created: Date.now(),
      updated: null,
      title: wheel.config.title,
      views: 0
    } satisfies ApiWheelMeta
  )
  await db.collection('wheels').doc(path).create({ path, ...wheel })
  return path
}

const getNewWheelPath = async () => {
  let path: string
  let snap
  do {
    path = 'abc-' + Math.floor(Math.random() * 1000)
    snap = await db.doc(`wheel-meta/${path}`).get()
  } while (snap.exists)
  return path
}
