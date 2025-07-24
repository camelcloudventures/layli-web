/**
 * Utility function to validate and fix Supabase image URLs
 */
export function validateImageUrl(url: string | null | undefined): string {
  if (!url) return ''

  // Check if the URL is truncated
  if (
    url.includes('/avatars/IMG_2879_Origina') &&
    !url.endsWith('.jpg') &&
    !url.endsWith('.png')
  ) {
    // Fix the truncated URL by adding the extension
    return `${url}l.jpg`
  }

  // Check if the URL is valid
  try {
    new URL(url)
    return url
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.error('Invalid image URL:', url)
    return ''
  }
}
