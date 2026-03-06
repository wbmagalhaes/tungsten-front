export const PALETTE_GLITCH =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§ΔΩΨλπ';

export function randomGlitchChar() {
  return PALETTE_GLITCH[Math.floor(Math.random() * PALETTE_GLITCH.length)];
}

export function randomGlitchArray(n: number) {
  return Array.from({ length: n }, randomGlitchChar);
}

export const PALETTE_DENSE =
  " `'.,:;~-_+<>!?i|/\\r(){}[]tfjlcxzuvwsnyeoaqJYCLUZXVODB80HKW#@$&%";

export function brightnessToChar(x: number) {
  return PALETTE_DENSE[Math.floor(x * (PALETTE_DENSE.length - 1))];
}
