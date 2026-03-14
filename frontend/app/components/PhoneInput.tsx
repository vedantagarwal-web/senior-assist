'use client';

import { useState } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helpText?: string;
}

export default function PhoneInput({
  value,
  onChange,
  required = false,
  label = 'Phone Number',
  placeholder = '+1 (555) 123-4567',
  helpText
}: PhoneInputProps) {
  const [error, setError] = useState('');

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Format as E.164 (+1XXXXXXXXXX)
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 11) return `+${digits}`;
    
    // Limit to 11 digits (1 + 10 for US)
    return `+${digits.slice(0, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
    
    // Validate
    if (formatted && formatted.length < 12) {
      setError('Phone number must be 11 digits (+1XXXXXXXXXX)');
    } else {
      setError('');
    }
  };

  const displayFormat = (phone: string) => {
    if (!phone || phone.length < 2) return phone;
    
    // Display as: +1 (XXX) XXX-XXXX
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
    }
    return phone;
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="tel"
        required={required}
        value={displayFormat(value)}
        onChange={handleChange}
        className={`w-full border rounded-lg px-4 py-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {helpText && !error && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
