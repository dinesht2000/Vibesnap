interface ProfilePictureProps {
  imageUrl?: string;
  name: string;
  isEditing: boolean;
  isOwnProfile: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ProfilePicture({
  imageUrl,
  name,
  isEditing,
  isOwnProfile,
  onImageChange,
  fileInputRef,
}: ProfilePictureProps) {
  return (
    <div className="absolute -bottom-12 left-4 z-20">
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-24 h-24 rounded-full object-cover shadow-black/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-md">
            <span className="text-gray-600 text-3xl font-medium">
              {name[0]?.toUpperCase()}
            </span>
          </div>
        )}
        {isEditing && isOwnProfile && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 hover:bg-gray-100 shadow-lg"
          >
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

