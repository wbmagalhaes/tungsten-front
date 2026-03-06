export function validatePassword(password: string): string | null {
  if (password.length < 10) {
    return 'must be at least 10 characters long';
  }

  if (password.includes(' ')) {
    return 'must not contain spaces';
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return 'must contain letters and numbers';
  }

  return null;
}
