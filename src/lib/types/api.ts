import type { Entry } from '$lib/utils/Wheel'
import type WheelConfig from '$lib/utils/WheelConfig'

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
