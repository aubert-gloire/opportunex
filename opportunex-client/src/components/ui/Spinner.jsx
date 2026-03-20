const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-2',
    xl: 'w-14 h-14 border-2',
  };

  return (
    <div
      className={`${sizes[size]} border-stone-200 border-t-primary rounded-full animate-spin ${className}`}
    />
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <Spinner size="xl" />
    <p className="mt-6 text-[11px] uppercase tracking-label text-stone-400">{message}</p>
  </div>
);

export default Spinner;
