import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { getWheel } from '$lib/server/FirebaseAdmin'
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
    const wheel = await getWheel(params.path)
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
        error : { message: `Error when fetching wheel "${params.path}"` }
      } satisfies ApiError),
      { status: 500 }
    )
  }
}
