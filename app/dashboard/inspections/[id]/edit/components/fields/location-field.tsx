'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import { loadGoogleMapsApi } from '@/lib/utils/google-maps'
import type {
  Question,
  Response,
  LocationData,
  LocationResponse,
} from '@/lib/types/inspection-types'

interface LocationFieldProps {
  question: Question
  response?: Response
  onResponse: (value: LocationResponse) => void
  isDisabled?: boolean
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
  isDisabled,
}: LocationFieldProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(() => {
    // Initialize from the structured location_data field if it exists,
    // otherwise, there's no initial location.
    if (
      response?.location_data &&
      response.location_data.address &&
      response.location_data.latitude &&
      response.location_data.longitude
    ) {
      return {
        address: response.location_data.address,
        latitude: response.location_data.latitude,
        longitude: response.location_data.longitude,
        place_id: response.location_data.place_id || undefined,
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
      console.log('called here')
      setLocationData(newLocationData)

      // backend expects this format
      const responseData: LocationResponse = {
        selected_options: [],
        response_value: newLocationData.address,
        location_data: newLocationData,
        inspector_notes: response?.inspector_notes,
        file_attachments: response?.file_attachments,
      }

      console.log('responseData', responseData)
      onResponse(responseData)
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
        <div className="relative w-full">
          <Input
            ref={inputRef}
            id={question.id.toString()}
            defaultValue={locationData?.address || ''}
            onBlur={handleInputBlur}
            placeholder="Search for an address or drop a pin"
            disabled={isLoading || isDisabled}
            className="pl-10 w-full"
          />
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
            onClick={!isDisabled ? getCurrentLocation : undefined}
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
          />
        </div>
        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Getting your location...
          </div>
        )}
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
