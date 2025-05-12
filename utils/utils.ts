export function extractTokens(url: string) {
  // Create a URL object (works in modern browsers and Node.js)
  const u = new URL(url)

  // 1) Try to parse fragment (everything after '#')
  const hashParams = new URLSearchParams(
    u.hash.startsWith('#') ? u.hash.slice(1) : '',
  )

  // 2) Parse query parameters (in case tokens were in ?token=… form)
  const queryParams = u.searchParams

  // Helper to look in fragment first, then query
  const getParam = (name: string) =>
    hashParams.get(name) ?? queryParams.get(name)

  return {
    accessToken: getParam('access_token'),
    refreshToken: getParam('refresh_token'),
  }
}
