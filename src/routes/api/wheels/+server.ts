import { z } from 'zod'
import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { saveWheel } from '$lib/server/FirebaseAdmin'
import type {
  ApiError, ApiSuccess, ApiWheel, WheelVisibility
} from '$lib/types/api'

export const POST = async ({ request }) => {
  // const apiKey = request.headers.get('x-api-key')

  // if (!apiKey || apiKey !== SVELTE_WHEEL_API_KEY) {
  //   return new Response(
  //     JSON.stringify(
  //       {
  //         success: false,
  //         error: { message: 'Unauthorized' }
  //       } satisfies ApiError
  //     ),
  //     { status: 401 }
  //   )
  // }

  const wheelSchema = z.object({
    wheel: z.object({
      config: z.object({
        title: z.string(),
        description: z.string(),
        spinTime: z.number().min(1).max(60)
      }),
      entries: z.array(
        z.object({
          text: z.string(),
          id: z.string().min(5).max(20)
        })
      )
    }),
    visibility: z.string(),
    uid: z.string()
  })

  const body = await request.json() as {
    wheel: ApiWheel, uid: string, visibility: WheelVisibility
  }

  try {
    wheelSchema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify(
          {
            success: false,
            error: {
              message: 'Invalid wheel',
              errors: error.flatten().fieldErrors
            }
          } satisfies ApiError
        ),
        { status: 400 }
      )
    }
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: { message: 'Invalid wheel' }
        } satisfies ApiError
      ),
      { status: 400 }
    )
  }

  try {
    const path = await saveWheel(body.wheel, body.uid, body.visibility)

    return new Response(
      JSON.stringify(
        {
          success: true,
          data: { path }
        } satisfies ApiSuccess<{ path: string }>
      ),
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify(
        {
          success: false,
          error: { message: 'Error when saving wheel' }
        } satisfies ApiError
      ),
      { status: 500 }
    )
  }
}
