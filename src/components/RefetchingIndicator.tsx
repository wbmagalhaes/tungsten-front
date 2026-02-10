export function RefetchingIndicator() {
  return (
    <div className='fixed top-12 left-16 right-0 w-full h-0.5 bg-gray-800 pointer-events-none z-10 overflow-hidden'>
      <div className='h-full w-1/3 bg-linear-to-r from-transparent via-primary to-transparent animate-loading-bar' />
    </div>
  );
}
