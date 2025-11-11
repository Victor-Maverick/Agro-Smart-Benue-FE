'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'

interface ToastData {
    id: string
    type: 'success' | 'error'
    message: string
    subMessage?: string
    duration?: number
}

interface ToastContextType {
    showToast: (type: 'success' | 'error', message: string, subMessage?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([])

    const showToast = (type: 'success' | 'error', message: string, subMessage?: string, duration?: number) => {
        const id = Date.now().toString()
        const newToast: ToastData = {
            id,
            type,
            message,
            subMessage,
            duration
        }

        setToasts(prev => [...prev, newToast])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    subMessage={toast.subMessage}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    )
}