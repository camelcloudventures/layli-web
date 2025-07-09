'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import { loadGoogleMapsApi } from '@/lib/utils/google-maps'
import type { Question, Response } from '@/lib/types/inspection-types'

interface LocationData {
  address: string
  latitude: number
  longitude: number
  place_id?: string
}

interface LocationResponse {
  selected_options: number[]
  response_value: string
  location_data?: LocationData
  inspector_notes?: string
  file_attachments?: Array<{
    filename: string
    file_path: string
    file_size: number
    mime_type: string
  }>
}

interface LocationFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

type GoogleAutocomplete = {
  addListener: (event: string, handler: () => void) => void
  getPlace: () => {
    geometry?: {
      location?: {
        lat: () => number
        lng: () => number
      }
    }
    formatted_address?: string
    place_id?: string
  }
}

declare global {
  interface Window {
    google: {
      maps: {
        event: {
          clearInstanceListeners: (instance: GoogleAutocomplete) => void
        }
        Geocoder: new () => {
          geocode: (request: {
            location?: { lat: number; lng: number }
            placeId?: string
            address?: string
          }) => Promise<{
            results: Array<{
              formatted_address: string
              place_id: string
              geometry: {
                location: {
                  lat: () => number
                  lng: () => number
                }
              }
            }>
          }>
        }
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[]
              componentRestrictions?: { country: string }
              fields?: string[]
            },
          ) => GoogleAutocomplete
        }
      }
    }
  }
}

export function LocationField({
  question,
  response,
  onResponse,
}: LocationFieldProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(() => {
    if (response?.response_value) {
      try {
        // Try to parse location data from the response
        const parsedResponse = JSON.parse(response.response_value)
        if (parsedResponse.location_data) {
          return parsedResponse.location_data
        }
        return null
      } catch (error) {
        console.error('Error parsing location data:', error)
        return null
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)
  const shouldGetLocation = useRef(!response?.response_value)
  const geocoderRef = useRef<Window['google']['maps']['Geocoder'] | null>(null)

  const handleLocationUpdate = useCallback(
    (newLocationData: LocationData) => {
      setLocationData(newLocationData)

      // Create the response object in the format expected by the backend
      const responseData: LocationResponse = {
        selected_options: [],
        response_value: newLocationData.address, // Use address as the main response value
        location_data: newLocationData, // Store full location data in a separate field
        inspector_notes: response?.inspector_notes, // Preserve existing notes
        file_attachments: response?.file_attachments, // Preserve existing attachments
      }

      onResponse(JSON.stringify(responseData))
    },
    [onResponse, response?.inspector_notes, response?.file_attachments],
  )

  const geocodeAddress = useCallback(
    async (address: string) => {
      if (!window.google || !geocoderRef.current) return

      try {
        setIsLoading(true)
        //@ts-expect-error - geocoderRef.current is not typed
        const response = await geocoderRef.current.geocode({
          address,
          componentRestrictions: { country: 'ke' },
        })

        if (response.results[0]) {
          const place = response.results[0]
          const newLocationData = {
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            place_id: place.place_id,
          }
          handleLocationUpdate(newLocationData)
        }
      } catch (error) {
        console.error('Error geocoding address:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [handleLocationUpdate],
  )

  const handleInputBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value.trim()
      if (!value || !geocoderRef.current) return

      // Only geocode if the value is different from current address
      if (value !== locationData?.address) {
        await geocodeAddress(value)
      }
    },
    [geocodeAddress, locationData?.address],
  )

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation || !window.google || isLoading) return

    setIsLoading(true)
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        },
      )

      if (!geocoderRef.current) {
        //@ts-expect-error - geocoderRef.current is not typed
        geocoderRef.current = new window.google.maps.Geocoder()
      }

      //@ts-expect-error - geocoderRef.current is not typed
      const response = await geocoderRef.current.geocode({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      })

      if (response.results[0]) {
        const place = response.results[0]
        const newLocationData = {
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          place_id: place.place_id,
        }
        handleLocationUpdate(newLocationData)
        if (inputRef.current) {
          inputRef.current.value = place.formatted_address
        }
      }
    } catch (error) {
      console.error('Error getting location:', error)
    } finally {
      setIsLoading(false)
    }
  }, [handleLocationUpdate, isLoading])

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || hasInitialized.current || !window.google) return

    // Initialize geocoder
    //@ts-expect-error - geocoderRef.current is not typed
    geocoderRef.current = new window.google.maps.Geocoder()

    const options = {
      types: ['address'],
      componentRestrictions: { country: 'ke' },
      fields: [
        'address_components',
        'geometry',
        'place_id',
        'formatted_address',
      ],
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options,
    )

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place?.geometry?.location) return

      handleLocationUpdate({
        address: place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        place_id: place.place_id,
      })
    })

    hasInitialized.current = true
  }, [handleLocationUpdate])

  useEffect(() => {
    loadGoogleMapsApi(() => {
      initializeAutocomplete()
      if (shouldGetLocation.current) {
        shouldGetLocation.current = false
        getCurrentLocation()
      }
    })

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [initializeAutocomplete, getCurrentLocation])

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}`}>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          id={`question-${question.id}`}
          type="text"
          name="response_value"
          defaultValue={locationData?.address || ''}
          placeholder={
            isLoading ? 'Getting your location...' : 'Enter location...'
          }
          className="w-full"
          disabled={isLoading}
          onBlur={handleInputBlur}
        />
      </div>
      {locationData && (
        <div className="text-sm text-muted-foreground">
          Lat: {locationData.latitude.toFixed(6)}, Long:{' '}
          {locationData.longitude.toFixed(6)}
        </div>
      )}
    </div>
  )
}
