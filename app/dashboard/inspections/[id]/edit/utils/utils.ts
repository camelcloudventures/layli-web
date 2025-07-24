export const getTextColor = (backgroundColor: string) => {
  try {
    // Handle hex colors with or without #
    const hex = backgroundColor.startsWith('#')
      ? backgroundColor.slice(1)
      : backgroundColor

    // Ensure we have a valid 6-character hex
    if (hex.length !== 6) {
      return '#1a1a1a' // Default to dark gray for invalid colors
    }

    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // Check for invalid RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return '#1a1a1a'
    }

    // Calculate relative luminance using WCAG 2.1 formula
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

    // Calculate color saturation
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max

    // More nuanced text color selection
    if (luminance > 0.7) {
      // Very light backgrounds - use dark colors
      return saturation > 0.3 ? '#1a1a1a' : '#2d2d2d'
    } else if (luminance > 0.5) {
      // Medium light backgrounds - use medium dark colors
      return saturation > 0.4 ? '#1a1a1a' : '#404040'
    } else if (luminance > 0.3) {
      // Medium dark backgrounds - use light colors
      return saturation > 0.5 ? '#ffffff' : '#f0f0f0'
    } else {
      // Very dark backgrounds - use light colors
      return saturation > 0.3 ? '#ffffff' : '#e0e0e0'
    }
  } catch (error) {
    console.warn('Error calculating text color for:', backgroundColor, error)
    return '#1a1a1a' // Default to dark gray on error
  }
}
