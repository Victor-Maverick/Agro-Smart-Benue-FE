export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
    if (!phone) {
        return { isValid: false, error: 'Phone number is required' };
    }
    
    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 11) {
        return { isValid: false, error: 'Phone number must be exactly 11 digits' };
    }
    
    // Check if it starts with 0 (Nigerian format)
    if (!cleanPhone.startsWith('0')) {
        return { isValid: false, error: 'Phone number must start with 0' };
    }
    
    return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    
    return { isValid: true };
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
    if (!name) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (name.length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name)) {
        return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }
    
    return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
        return { isValid: false, error: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }
    
    return { isValid: true };
};