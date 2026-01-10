interface EmptyStateProps {
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function EmptyState({ message, buttonText, onButtonClick }: EmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">{message}</p>
        {buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

