interface ProfileEditButtonProps {
  onEditClick: () => void;
}

export default function ProfileEditButton({ onEditClick }: ProfileEditButtonProps) {
  return (
    <div className="absolute -bottom-12 left-32 z-20">
      <button
        onClick={onEditClick}
        className="px-22 py-1.5 border border-gray-300 bg-white text-gray-900 rounded-full text-sm font-medium shadow-sm"
      >
        Edit Profile
      </button>
    </div>
  );
}

