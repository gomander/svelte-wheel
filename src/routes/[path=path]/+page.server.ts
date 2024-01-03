import { error } from '@sveltejs/kit'
import { SVELTE_WHEEL_API_KEY } from '$env/static/private'
import { getWheel } from '$lib/utils/Api'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
  const response = await getWheel(
    params.path,
    null,
    SVELTE_WHEEL_API_KEY,
    fetch
  )
  if (!response.success) {
    error(404, response.error.message)
  }
  return { wheel: response.data.wheel }
}
