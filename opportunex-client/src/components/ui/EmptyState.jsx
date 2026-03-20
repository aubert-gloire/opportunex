const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={`text-center py-16 ${className}`}>
    {Icon && (
      <div className="flex justify-center mb-5">
        <Icon className="w-10 h-10 text-stone-200" />
      </div>
    )}
    <h3 className="font-display text-lg font-normal text-stone-700 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-stone-400 mb-8 max-w-sm mx-auto leading-relaxed">{description}</p>
    )}
    {action && <div>{action}</div>}
  </div>
);

export default EmptyState;
