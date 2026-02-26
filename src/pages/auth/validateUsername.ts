export default function validateUsername(input: string): string | null {
  const value = input.trim().toLowerCase();

  if (value.length < 3 || value.length > 32) {
    return 'Must be between 3 and 32 characters';
  }

  const valid = /^[a-z0-9_.-]+$/.test(value);
  if (!valid) {
    return "Only letters, numbers and '_', '-' or '.' are allowed";
  }

  return null;
}
