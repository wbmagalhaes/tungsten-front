export function isDesktop() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 768px)').matches
  );
}
