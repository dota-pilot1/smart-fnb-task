interface CommonCardForListProps {
  title: string;
  description?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export function CommonCardForList({ title, description, onClick, onDelete }: CommonCardForListProps) {
  return (
    <div
      onClick={onClick}
      className="group relative border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-white"
    >
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
        >
          x
        </button>
      )}
      <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
      )}
    </div>
  );
}
