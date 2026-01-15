// 📁 src/pages/ClientInfo/utils/emailValidation.js

/**
 * Email validation utility for real-time field validation
 * Centralized email regex pattern and validation helpers
 */

// Improved email regex: requires proper format with at least 2-char TLD
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Check if an email is valid (or empty - empty is valid, use required validation separately)
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid or empty, false if invalid format
 */
export const isValidEmail = (email) => {
  if (!email || !email.trim()) return true; // Empty is valid (use required validation separately)
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Get error message for invalid email
 * @param {string} email - The email to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getEmailError = (email) => {
  if (!email || !email.trim()) return '';
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address (e.g., name@company.com).';
  }
  return '';
};

/**
 * React hook helper for email validation state
 * Usage: const [emailError, validateEmail, clearEmailError] = useEmailValidation();
 * 
 * Example:
 * <TextField
 *   value={email}
 *   onChange={(e) => { setEmail(e.target.value); if (emailError) clearEmailError(); }}
 *   onBlur={(e) => validateEmail(e.target.value)}
 *   error={!!emailError}
 *   helperText={emailError}
 * />
 */
export const createEmailValidator = () => {
  let error = '';
  
  const validate = (email) => {
    error = getEmailError(email);
    return error;
  };
  
  const clear = () => {
    error = '';
  };
  
  const getError = () => error;
  
  return { validate, clear, getError };
};

export default {
  EMAIL_REGEX,
  isValidEmail,
  getEmailError,
  createEmailValidator,
};
