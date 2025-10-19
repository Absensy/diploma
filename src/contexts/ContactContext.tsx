"use client"
import React, { createContext, useContext, ReactNode } from 'react'
import { useContactInfo } from '@/hooks/useContactInfo'

interface ContactContextType {
    contactInfo: any
    loading: boolean
    error: string | null
}

interface ContactProviderProps {
    children: ReactNode
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export const ContactProvider = ({ children }: ContactProviderProps) => {
    const contactContextValue = useContactInfo()

    return (
        <ContactContext.Provider value={contactContextValue}>
            {children}
        </ContactContext.Provider>
    )
}

export const useContactContext = () => {
    const context = useContext(ContactContext)
    if (context === undefined) {
        throw new Error('useContactContext must be used within a ContactProvider')
    }
    return context
}
