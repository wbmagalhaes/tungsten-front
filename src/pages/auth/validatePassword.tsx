export function validatePassword(password: string): string | null {
  if (password.length < 12) {
    return 'must be at least 12 characters long';
  }

  if (password.includes(' ')) {
    return 'must not contain spaces';
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (!hasLetter || !hasNumber || !hasSpecial) {
    return 'must contain letters, numbers and special characters';
  }

  return null;
}
