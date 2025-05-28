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

export const getFrequencyColor = (frequency: string) => {
  switch (frequency) {
    case 'daily':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    case 'weekly':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'monthly':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    case 'yearly':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'paused':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
