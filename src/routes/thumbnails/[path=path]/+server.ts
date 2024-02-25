import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import validateColor from 'validate-color'
import { createThumbnail } from '$lib/server/Thumbnail'
import { getWheel } from '$lib/server/FirebaseAdmin'
import Wheel, { addIdsToEntries } from '$lib/utils/Wheel'
import type { ApiError } from '$lib/utils/Api'

export const GET = async ({ request, params, url, setHeaders }) => {
  const uid = request.headers.get('authorization')
  const apiKey = request.headers.get('x-api-key')
  if (apiKey && apiKey !== SVELTE_WHEEL_API_KEY) {
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
    const size = Math.max(Math.min(Number(url.searchParams.get('size')) || 300, 700), 50)
    let background: string | undefined = url.searchParams.get('background') ?? undefined
    if (background && !validateColor(background)) {
      background = undefined
    }
    const image = await createThumbnail(
      new Wheel({
        config: wheel.config,
        entries: addIdsToEntries(wheel.entries)
      }),
      size,
      background
    )
    setHeaders({'Content-Type': 'image/webp', 'Content-Length': image.byteLength.toString()})
    return new Response(image, { status: 200 })
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
