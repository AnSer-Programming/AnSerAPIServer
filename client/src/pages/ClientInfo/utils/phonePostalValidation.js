// 📁 src/pages/ClientInfo/utils/phonePostalValidation.js

/**
 * Phone number and postal code validation utilities for real-time field validation
 */

// ========================
// PHONE NUMBER VALIDATION
// ========================

// US/Canada phone: (XXX) XXX-XXXX or similar formats
const US_PHONE_REGEX = /^[\d\s()+-]{10,}$/;

// More flexible international phone pattern
const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;

/**
 * Check if a phone number is valid (or empty)
 * @param {string} phone - The phone to validate
 * @returns {boolean} - True if valid or empty
 */
export const isValidPhone = (phone) => {
  if (!phone || !phone.trim()) return true;
  const cleaned = phone.replace(/\s/g, '');
  return PHONE_REGEX.test(cleaned) && cleaned.replace(/\D/g, '').length >= 7;
};

/**
 * Get error message for invalid phone
 * @param {string} phone - The phone to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getPhoneError = (phone) => {
  if (!phone || !phone.trim()) return '';
  if (!isValidPhone(phone)) {
    return 'Please enter a valid phone number (e.g., (555) 123-4567).';
  }
  return '';
};

/**
 * Format phone number as user types (US format)
 * @param {string} value - Raw input value
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    // Handle numbers with country code
    return `+${digits.slice(0, digits.length - 10)} (${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
  }
};

// ========================
// POSTAL CODE VALIDATION
// ========================

// US ZIP: 12345 or 12345-6789
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;

// Canadian: A1A 1A1 or A1A1A1
const CANADIAN_POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

/**
 * Check if a postal code is valid (or empty)
 * @param {string} postal - The postal code to validate
 * @returns {boolean} - True if valid or empty
 */
export const isValidPostalCode = (postal) => {
  if (!postal || !postal.trim()) return true;
  const cleaned = postal.trim();
  return US_ZIP_REGEX.test(cleaned) || CANADIAN_POSTAL_REGEX.test(cleaned);
};

/**
 * Get error message for invalid postal code
 * @param {string} postal - The postal code to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getPostalCodeError = (postal) => {
  if (!postal || !postal.trim()) return '';
  if (!isValidPostalCode(postal)) {
    return 'Please enter a valid ZIP (12345) or postal code (A1A 1A1).';
  }
  return '';
};

/**
 * Format postal code as user types
 * @param {string} value - Raw input value
 * @param {string} countryHint - 'US' or 'CA' hint for formatting
 * @returns {string} - Formatted postal code
 */
export const formatPostalCode = (value, countryHint = 'auto') => {
  if (!value) return '';
  
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Detect format based on content
  const hasLetters = /[A-Z]/.test(cleaned);
  
  if (countryHint === 'CA' || (countryHint === 'auto' && hasLetters)) {
    // Canadian format: A1A 1A1
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  } else {
    // US format: 12345 or 12345-6789
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length <= 5) {
      return digits;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    }
  }
};

export default {
  isValidPhone,
  getPhoneError,
  formatPhoneNumber,
  isValidPostalCode,
  getPostalCodeError,
  formatPostalCode,
  US_PHONE_REGEX,
  US_ZIP_REGEX,
  CANADIAN_POSTAL_REGEX,
};
