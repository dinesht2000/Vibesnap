interface CreatePostButtonProps {
  isUploading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function CreatePostButton({
  isUploading,
  disabled,
  onClick,
}: CreatePostButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full bg-black text-white py-4 rounded-full font-semibold text-base uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
      >
        {isUploading ? "Creating..." : "CREATE"}
      </button>
    </div>
  );
}

