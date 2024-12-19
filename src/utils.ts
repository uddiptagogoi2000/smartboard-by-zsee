export const calculatePasswordStrength = (password: string): number => {
  let strength = -1;
  if (password.length >= 8) strength++; // Length rule
  if (/[A-Z]/.test(password)) strength++; // Uppercase letter
  if (/[a-z]/.test(password)) strength++; // Lowercase letter
  if (/[0-9]/.test(password)) strength++; // Number
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // Symbol
  return strength; // Maximum strength = 5
};

export function capitalizeFirstLetter(text?: string): string {
  if (!text) return ''; // Handle undefined or null cases
  return text.charAt(0).toUpperCase() + text.slice(1);
}
