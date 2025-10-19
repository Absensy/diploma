"use client"

import { useState, useEffect } from 'react'

interface ContactInfo {
  id: number
  address: string
  phone: string
  email: string
  instagram?: string
  working_hours: string
}

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/contact')
        if (!response.ok) {
          throw new Error('Failed to fetch contact info')
        }
        const data = await response.json()
        setContactInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchContactInfo()
  }, [])

  return { contactInfo, loading, error }
}
