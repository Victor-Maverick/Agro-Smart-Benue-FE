# Form Validation Guide

This guide explains how to implement proper form validation throughout the BFPC application.

## Overview

The application now uses a consistent validation system with:
- **Custom Toast notifications** positioned at top-right
- **Field-level validation** with error display
- **Phone number validation** (11 digits, numbers only)
- **Email validation** with proper format checking
- **Name validation** (letters, spaces, hyphens, apostrophes only)
- **Backend error handling** with proper error messages

## Components

### 1. Toast System

**Location**: `components/Toast.tsx` and `contexts/ToastContext.tsx`

**Usage**:
```tsx
import { useToast } from '@/contexts/ToastContext'

const { showToast } = useToast()

// Success toast
showToast('success', 'Success!', 'Operation completed successfully.')

// Error toast
showToast('error', 'Error!', 'Something went wrong.')
```

### 2. Input Validation

**Location**: `lib/validation.ts`

**Available validators**:
- `validateEmail(email: string)`
- `validatePhone(phone: string)` - 11 digits, starts with 0
- `validatePassword(password: string)` - minimum 6 characters
- `validateName(name: string, fieldName: string)` - letters, spaces, hyphens, apostrophes
- `validateConfirmPassword(password: string, confirmPassword: string)`
- `validateRequired(value: string, fieldName: string)`

### 3. Enhanced InputField Component

**Location**: `components/ui/InputField.tsx`

**New features**:
- Automatic phone number formatting (numbers only, 11 digit limit)
- Name field validation (letters only)
- Error display with red border
- Real-time input filtering

**Usage**:
```tsx
<InputField
  id="phone"
  label="Phone Number"
  value={formData.phone}
  onChange={(value) => handleInputChange("phone", value)}
  placeholder="Phone Number"
  type="tel"
  icon="phone"
  error={errors.phone}
/>
```

## Implementation Examples

### Login/Signup Forms

All login and signup forms have been updated to use:
1. New toast system for error messages
2. Field-level validation with error display
3. Backend error message handling

### Form Validation Hook

**Location**: `hooks/useFormValidation.ts`

**Usage**:
```tsx
import { useFormValidation, signupValidationRules } from '@/hooks/useFormValidation'

const {
  formData,
  errors,
  handleInputChange,
  validateForm
} = useFormValidation(initialData, signupValidationRules)
```

## Phone Number Validation Rules

- **Length**: Exactly 11 digits
- **Format**: Must start with 0 (Nigerian format)
- **Characters**: Numbers only (non-digits automatically removed)
- **Example**: `08012345678`

## Backend Error Handling

The AuthContext now returns structured error responses:

```tsx
const result = await login(email, password)
if (result.success) {
  showToast('success', 'Welcome!', 'Login successful')
} else {
  showToast('error', 'Login Failed', result.error)
}
```

## Migration Guide

To update existing forms:

1. **Replace toast imports**:
   ```tsx
   // Old
   import { useToast } from "@/hooks/use-toast"
   const { toast } = useToast()
   
   // New
   import { useToast } from "@/contexts/ToastContext"
   const { showToast } = useToast()
   ```

2. **Add error state**:
   ```tsx
   const [errors, setErrors] = useState<{ [key: string]: string }>({})
   ```

3. **Update validation**:
   ```tsx
   // Old
   if (!email) {
     toast({ title: "Error", description: "Email required" })
     return false
   }
   
   // New
   const emailValidation = validateEmail(email)
   if (!emailValidation.isValid) {
     newErrors.email = emailValidation.error!
   }
   ```

4. **Update InputField props**:
   ```tsx
   <InputField
     // ... existing props
     error={errors.fieldName}
   />
   ```

5. **Update toast calls**:
   ```tsx
   // Old
   toast({ title: "Success", description: "Done!" })
   
   // New
   showToast('success', 'Success', 'Done!')
   ```

## Toast Positioning

All toasts now appear at the **top-right** of the screen with consistent styling:
- Success: Green background with checkmark icon
- Error: Red background with error icon
- Auto-dismiss after 5 seconds
- Manual close button available