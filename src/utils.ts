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

function shouldDeepCompare(type: string) {
  return type === '[object Object]' || type === '[object Array]';
}

function getType(value: unknown): string {
  return Object.prototype.toString.call(value);
}

export default function deepEqual(valueA: unknown, valueB: unknown): boolean {
  // Check for arrays/objects equality.
  const type1 = getType(valueA);
  const type2 = getType(valueB);

  // Only compare the contents if they're both arrays or both objects.
  if (type1 === type2 && shouldDeepCompare(type1) && shouldDeepCompare(type2)) {
    const entriesA = Object.entries(valueA as Array<unknown> | Object);
    const entriesB = Object.entries(valueB as Array<unknown> | Object);

    if (entriesA.length !== entriesB.length) {
      return false;
    }

    return entriesA.every(
      // Make sure the other object has the same properties defined.
      ([k, v]) =>
        Object.hasOwn(valueB as Array<unknown> | Object, k) &&
        deepEqual(v, (valueB as any)[k])
    );
  }

  // Check for primitives + type equality.
  return Object.is(valueA, valueB);
}
