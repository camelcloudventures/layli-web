let isLoading = false
let isLoaded = false
const callbacks: (() => void)[] = []

export const loadGoogleMapsApi = (callback: () => void) => {
  // If already loaded, call the callback immediately
  if (isLoaded && window.google) {
    callback()
    return
  }

  // Add callback to queue
  callbacks.push(callback)

  // If already loading, wait for it to complete
  if (isLoading) {
    return
  }

  isLoading = true

  // Create the script element
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
  script.async = true
  script.defer = true

  // Handle script load
  script.onload = () => {
    isLoaded = true
    isLoading = false
    // Execute all callbacks
    callbacks.forEach((cb) => cb())
    // Clear the callbacks array
    callbacks.length = 0
  }

  // Handle script error
  script.onerror = () => {
    console.error('Failed to load Google Maps API')
    isLoading = false
    // Clear the callbacks array
    callbacks.length = 0
  }

  // Add script to document
  document.head.appendChild(script)
}
