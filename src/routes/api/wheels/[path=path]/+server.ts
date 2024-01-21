import { z } from 'zod'
import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { getWheel, updateWheel, deleteWheel } from '$lib/server/FirebaseAdmin'
import { updateWheelSchema } from '$lib/utils/Schemas'
import type { ApiError, ApiSuccess, ApiWheel } from '$lib/utils/Api'

export const GET = async ({ request, params }) => {
  const uid = request.headers.get('authorization')
  const apiKey = request.headers.get('x-api-key')
  if (
    (!uid && !apiKey) ||
    (apiKey && apiKey !== SVELTE_WHEEL_API_KEY)
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: 'Unauthorized' }
      } satisfies ApiError),
      { status: 401 }
    )
  }
  try {
    const wheel = await getWheel(params.path, uid)
    if (!wheel) {
      return new Response(
        JSON.stringify({
          success: false,
          error : { message: `Wheel "${params.path}" not found` }
        } satisfies ApiError),
        { status: 404 }
      )
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: { wheel }
      } satisfies ApiSuccess<{ wheel: ApiWheel }>),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: `Error fetching wheel "${params.path}"` }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}

export const PUT = async ({ request, params }) => {
  const uid = request.headers.get('authorization')
  const apiKey = request.headers.get('x-api-key')
  if (
    (!uid && !apiKey) ||
    (apiKey && apiKey !== SVELTE_WHEEL_API_KEY)
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: 'Unauthorized' }
      } satisfies ApiError),
      { status: 401 }
    )
  }
  try {
    const body = await request.json()
    const { wheel, uid, visibility } = updateWheelSchema.parse(body)
    const path = await updateWheel(params.path, wheel, uid, visibility)
    if (!path) {
      return new Response(
        JSON.stringify({
          success: false,
          error : { message: `Wheel "${params.path}" not found` }
        } satisfies ApiError),
        { status: 404 }
      )
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: { path }
      } satisfies ApiSuccess<{ path: string }>),
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: 'Invalid wheel',
            errors: error.flatten().fieldErrors
          }
        } satisfies ApiError),
        { status: 400 }
      )
    }
    console.error(error)
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: `Error updating wheel "${params.path}"` }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}

export const DELETE = async ({ request, params }) => {
  const uid = request.headers.get('authorization')
  if (!uid) {
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: 'Unauthorized' }
      } satisfies ApiError),
      { status: 401 }
    )
  }
  try {
    await deleteWheel(params.path, uid)
    return new Response(
      JSON.stringify({ success: true, data: null } satisfies ApiSuccess<null>),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        success: false,
        error : { message: `Error deleting wheel "${params.path}"` }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}
