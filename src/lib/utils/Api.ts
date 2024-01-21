import type { Entry } from '$lib/utils/Wheel'
import type WheelConfig from '$lib/utils/WheelConfig'

export const createWheel = async (
  data: CreateWheelData,
  uid?: string | null,
  apiKey?: string | null,
  fetch = window.fetch
) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (uid) {
    headers.authorization = uid
  }
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }
  const response = await fetch(
    '/api/wheels',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }
  )
  return await response.json() as ApiResponse<{ path: string }>
}

export const updateWheel = async (
  path: string,
  data: UpdateWheelData,
  uid?: string | null,
  apiKey?: string | null,
  fetch = window.fetch
) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (uid) {
    headers.authorization = uid
  }
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }
  const response = await fetch(
    `/api/wheels/${path}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    }
  )
  return await response.json() as ApiResponse<{ path: string }>
}

export const getWheel = async (
  path: string,
  uid?: string | null,
  apiKey?: string | null,
  fetch = window.fetch
) => {
  const headers: HeadersInit = {}
  if (uid) {
    headers.authorization = uid
  }
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }
  const response = await fetch(`/api/wheels/${path}`, { headers })
  return await response.json() as ApiResponse<{ wheel: ApiWheel }>
}

export const getWheels = async (uid: string, fetch = window.fetch) => {
  const response = await fetch(
    '/api/wheels',
    { headers: { authorization: uid } }
  )
  return await response.json() as ApiResponse<{ wheels: ApiWheelMeta[] }>
}

export const deleteWheel = async (
  path: string, uid: string, fetch = window.fetch
) => {
  const response = await fetch(
    `/api/wheels/${path}`,
    { method: 'DELETE', headers: { authorization: uid } }
  )
  return await response.json() as ApiResponse<null>
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
  entries: Omit<Entry, 'id'>[]
}

export const wheelVisibilities = ['public', 'private'] as const
export type WheelVisibility = typeof wheelVisibilities[number]

export interface ApiWheelMeta {
  path: string
  uid: string
  visibility: WheelVisibility
  created: number
  updated: number | null
  title: string
  views: number
}

export interface CreateWheelMeta extends Omit<
  ApiWheelMeta, 'created' | 'updated'
> {
  created: Date
  updated: Date | null
}

export interface CreateWheelData {
  wheel: Omit<ApiWheel, 'path'>
  visibility: WheelVisibility
  uid: string
}

export type UpdateWheelData = Partial<CreateWheelData> & { uid: string }
