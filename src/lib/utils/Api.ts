import type { Entry } from '$lib/utils/Wheel'
import type WheelConfig from '$lib/utils/WheelConfig'

export const createWheel = async (data: CreateWheelData) => {
  const response = await fetch('/api/wheels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json() as ApiResponse<{ path: string }>
}

export const getWheel = async (path: string, uid?: string) => {
  const response = await fetch(`/api/wheels/${path}`,
    uid ? { headers: { authorization: uid } } : {}
  )
  return await response.json() as ApiResponse<{ wheel: ApiWheel }>
}

export const getWheels = async (uid: string) => {
  const response = await fetch('/api/wheels', {
    headers: { authorization: uid }
  })
  return await response.json() as ApiResponse<{ wheels: ApiWheel[] }>
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

export interface ApiSuccess<T = any> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    message: string,
    errors?: Record<string, string[] | undefined>
  }
}

export interface ApiUser {
  uid: string
  createdAt: Date
  lastActive: Date
  email?: string
  wheels: string[]
}

export interface ApiWheel {
  path: string
  config: WheelConfig
  entries: Entry[]
}

export type WheelVisibility = 'public' | 'private'

export interface ApiWheelMeta {
  path: string
  uid: string
  visibility: WheelVisibility
  created: number
  updated: number | null
  title: string
  views: number
}

export interface CreateWheelData {
  wheel: Omit<ApiWheel, 'path'>
  visibility: WheelVisibility
  uid: string
}
