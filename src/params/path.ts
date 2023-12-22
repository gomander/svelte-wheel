import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => {
  return /^\w\w\w\-\w\w\w$/.test(param)
}
