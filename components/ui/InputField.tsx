'use client'

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";

type InputFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    optional?: boolean;
    type?: string;
    icon?: 'email' | 'password' | 'phone' | 'none';
    maxLength?: number;
    pattern?: string;
    error?: string;
};

export const InputField = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    optional = false,
    type = "text",
    icon = 'none',
    maxLength,
    pattern,
    error
}: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const actualType = type === 'password' && showPassword ? 'text' : type;

    const validateInput = (inputValue: string): string => {
        // Phone number validation - only allow numbers and limit to 11 digits
        if (type === 'tel' || icon === 'phone') {
            inputValue = inputValue.replace(/\D/g, ''); // Remove non-digits
            if (inputValue.length > 11) {
                inputValue = inputValue.slice(0, 11); // Limit to 11 digits
            }
            return inputValue;
        }
        
        // Email validation - allow typing but maintain format
        if (type === 'email') {
            // Don't restrict characters for email during typing
            return inputValue;
        }

        // Text fields - prevent non-text characters if specified
        if (type === 'text' && (id === 'firstName' || id === 'lastName')) {
            // Only allow letters, spaces, hyphens, and apostrophes for names
            inputValue = inputValue.replace(/[^a-zA-Z\s\-']/g, '');
        }
        
        return inputValue;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const validatedValue = validateInput(e.target.value);
        onChange(validatedValue);
    };

    const renderIcon = () => {
        if (icon === 'email') {
            return <Mail className="h-5 w-5 text-[#6D6D6D]" />;
        }
        if (icon === 'password') {
            return <Lock className="h-5 w-5 text-[#6D6D6D]" />;
        }
        if (icon === 'phone') {
            return <Phone className="h-5 w-5 text-[#6D6D6D]" />;
        }
        return null;
    };

    const renderPasswordToggle = () => {
        if (type === 'password') {
            return (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6D6D6D] hover:text-[#022B23] transition-colors"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            );
        }
        return null;
    };

    return (
        <div className="relative w-full mb-[10px] flex flex-col">
            <label
                htmlFor={id}
                className={`absolute left-4 transition-all ${
                    isFocused || value
                        ? "text-[#6D6D6D] text-[12px] font-medium top-[6px]"
                        : "hidden"
                }`}
            >
                {label} {optional && <span className="text-[#B0B0B0]">(optional)</span>}
            </label>
            <div className="relative">
                {icon !== 'none' && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {renderIcon()}
                    </div>
                )}
                <input
                    id={id}
                    type={actualType}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={!isFocused && !value ? placeholder : ""}
                    className={`h-[58px] w-full border-[1.5px] ${
                        error ? 'border-red-500' : 'border-[#D1D1D1]'
                    } rounded-[14px] outline-none focus:border-[2px] ${
                        error ? 'focus:border-red-500' : 'focus:border-[#022B23]'
                    } ${
                        icon !== 'none' ? 'pl-12 pr-4' : 'px-4'
                    } ${
                        type === 'password' ? 'pr-12' : ''
                    } ${
                        isFocused || value
                            ? "pt-[14px] pb-[4px] text-[#121212] text-[14px] font-medium"
                            : "text-[#BDBDBD] text-[16px] font-medium"
                    }`}
                />
                {renderPasswordToggle()}
            </div>
            {error && (
                <span className="text-red-500 text-sm mt-1 ml-1">{error}</span>
            )}
        </div>
    );
};