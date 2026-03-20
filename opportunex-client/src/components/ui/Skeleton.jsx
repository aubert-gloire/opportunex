const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    rect: 'h-32 w-full',
    card: 'h-48 w-full',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${variants[variant]} ${className}`}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-3">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
