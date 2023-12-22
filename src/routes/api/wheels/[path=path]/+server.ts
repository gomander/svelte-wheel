import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { getWheel } from '$lib/server/FirebaseAdmin'
import type { ApiError, ApiSuccess, ApiWheel } from '$lib/types/api'

export const GET = async ({ request, url }) => {
  const uid = request.headers.get('authorization')
  const apiKey = request.headers.get('x-api-key')

  if (
    (!uid && !apiKey) ||
    (apiKey && apiKey !== SVELTE_WHEEL_API_KEY)
  ) {
    return new Response(
      JSON.stringify(
        {
          success: false,
          error : { message: 'Unauthorized' }
        } satisfies ApiError
      ),
      { status: 401 }
    )
  }

  const path = url.pathname.split('/').pop()!

  try {
    const wheel = await getWheel(path)

    if (!wheel) {
      return new Response(
        JSON.stringify(
          {
            success: false,
            error : { message: `Wheel "${path}" not found` }
          } satisfies ApiError
        ),
        { status: 404 }
      )
    }

    return new Response(
      JSON.stringify(
        {
          success: true,
          data: wheel
        } satisfies ApiSuccess<ApiWheel>
      ),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify(
        {
          success: false,
          error : { message: `Error when fetching wheel "${path}"` }
        } satisfies ApiError
      ),
      { status: 500 }
    )
  }
}
