const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text:   'h-3.5 w-full',
    title:  'h-5 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    rect:   'h-28 w-full',
    card:   'h-44 w-full',
  };

  return (
    <div className={`animate-pulse bg-stone-100 ${variants[variant]} ${className}`} />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white border border-stone-100 p-6">
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

export default Skeleton;
