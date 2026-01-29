// Helper utilities for validating and normalizing public contact channel values
// Used by CompanyBasicsSection to enforce/suggest formats for social handles and numbers.

export function normalizeContactValue(type, value = '') {
  if (typeof value !== 'string') return { value: '', changed: false };
  const trimmed = value.trim();

  // Social platforms that should start with @
  const atPlatforms = new Set(['x-twitter', 'twitter', 'facebook', 'instagram']);
  // Platforms that should start with + or digits (phone-like)
  const phonePlatforms = new Set(['phone', 'toll-free', 'whatsapp', 'fax', 'other']);

  if (atPlatforms.has(type)) {
    if (!trimmed) return { value: '', changed: false };
    if (trimmed.startsWith('@')) return { value: trimmed, changed: false };
    return { value: '@' + trimmed, changed: true };
  }

  if (phonePlatforms.has(type)) {
    // For phone-like platforms, keep digits, plus, and common separators.
    const cleaned = trimmed.replace(/[^\d+()\-\s]/g, '');
    return { value: cleaned, changed: cleaned !== trimmed };
  }

  if (type === 'website') {
    // ensure a minimal url-like string, but do not modify aggressively
    if (!trimmed) return { value: '', changed: false };
    if (/^https?:\/\//i.test(trimmed)) return { value: trimmed, changed: false };
    return { value: 'https://' + trimmed, changed: true };
  }

  // default: return as-is
  return { value: trimmed, changed: false };
}

export function validateContactValue(type, value = '') {
  if (typeof value !== 'string' || !value.trim()) return { valid: false, reason: 'empty' };
  const v = value.trim();

  if (['x-twitter', 'twitter', 'instagram', 'facebook'].includes(type)) {
    if (!v.startsWith('@')) return { valid: false, reason: "must start with '@'" };
    // basic handle length check
    const handle = v.slice(1);
    if (handle.length < 1 || handle.length > 30) return { valid: false, reason: 'invalid length' };
    return { valid: true };
  }

  if (type === 'website') {
    return { valid: true };
  }

  // phone-like: ensure at least one digit
  if (['phone', 'toll-free', 'whatsapp', 'fax', 'other'].includes(type)) {
    if (!/\d/.test(v)) return { valid: false, reason: 'must include a digit' };
    return { valid: true };
  }

  return { valid: true };
}

export default {
  normalizeContactValue,
  validateContactValue,
};
