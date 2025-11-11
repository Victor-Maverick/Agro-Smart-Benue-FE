import { useState } from 'react'
import { 
    validateEmail, 
    validatePhone, 
    validatePassword, 
    validateName, 
    validateConfirmPassword, 
    validateRequired,
    ValidationResult 
} from '@/lib/validation'

interface ValidationRules {
    [key: string]: (value: string, formData?: any) => ValidationResult
}

export const useFormValidation = (initialData: any, rules: ValidationRules) => {
    const [formData, setFormData] = useState(initialData)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {}

        Object.keys(rules).forEach(field => {
            const validation = rules[field](formData[field], formData)
            if (!validation.isValid) {
                newErrors[field] = validation.error!
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateField = (field: string): boolean => {
        if (rules[field]) {
            const validation = rules[field](formData[field], formData)
            if (!validation.isValid) {
                setErrors(prev => ({ ...prev, [field]: validation.error! }))
                return false
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[field]
                    return newErrors
                })
                return true
            }
        }
        return true
    }

    return {
        formData,
        errors,
        handleInputChange,
        validateForm,
        validateField,
        setFormData,
        setErrors
    }
}

// Common validation rule sets
export const loginValidationRules: ValidationRules = {
    email: validateEmail,
    password: (value) => validateRequired(value, 'Password')
}

export const signupValidationRules: ValidationRules = {
    firstName: (value) => validateName(value, 'First name'),
    lastName: (value) => validateName(value, 'Last name'),
    email: validateEmail,
    phone: validatePhone,
    password: validatePassword,
    confirmPassword: (value, formData) => validateConfirmPassword(formData?.password || '', value)
}