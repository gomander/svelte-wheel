import Wheel from '$lib/utils/Wheel'
import { createThumbnail } from '$lib/server/Thumbnail'
import { getWheel } from '$lib/server/FirebaseAdmin'

export const GET = async ({ setHeaders, params }) => {
  const wheelData = await getWheel(params.path)
  if (!wheelData) {
    return new Response(
      JSON.stringify({ error: 'Wheel not found' }),
      { status: 404 }
    )
  }
  const image = await createThumbnail(new Wheel(wheelData))
  setHeaders({
    'Content-Type': 'image/webp',
    'Content-Length': image.byteLength.toString()
  })
  return new Response(image, { status: 200 })
}
