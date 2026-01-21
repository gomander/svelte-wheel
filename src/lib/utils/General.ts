export function getStringFromError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') return error.toString()
  return 'An error occurred'
}
