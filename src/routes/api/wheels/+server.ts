import { z } from 'zod'
import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { getUserWheelsMeta, saveWheel } from '$lib/server/FirebaseAdmin'
import { createWheelSchema } from '$lib/utils/Schemas'
import type { ApiError, ApiSuccess, ApiWheelMeta } from '$lib/utils/Api'

export const GET = async ({ request }) => {
  const uid = request.headers.get('authorization')
  if (!uid) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: 'Unauthorized' }
      } satisfies ApiError),
      { status: 401 }
    )
  }
  try {
    const wheels = await getUserWheelsMeta(uid)
    return new Response(
      JSON.stringify({
        success: true,
        data: { wheels }
      } satisfies ApiSuccess<{ wheels: ApiWheelMeta[] }>),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: 'Error getting wheels' }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}

export const POST = async ({ request }) => {
  const apiKey = request.headers.get('x-api-key')
  const uid = request.headers.get('authorization')
  if (
    (!uid && !apiKey) ||
    (apiKey && apiKey !== SVELTE_WHEEL_API_KEY)
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: 'Unauthorized' }
      } satisfies ApiError),
      { status: 401 }
    )
  }
  try {
    const body = await request.json()
    const data = createWheelSchema.parse(body)
    const path = await saveWheel(data.wheel, data.uid, data.visibility)
    return new Response(
      JSON.stringify({
        success: true,
        data: { path }
      } satisfies ApiSuccess<{ path: string }>),
      { status: 201 }
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
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: 'Error saving wheel' }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}
