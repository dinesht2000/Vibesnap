interface ProfileBannerProps {
  bannerUrl?: string;
  isEditing: boolean;
  isOwnProfile: boolean;
  onBackClick: () => void;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ProfileBanner({
  bannerUrl,
  isEditing,
  isOwnProfile,
  onBackClick,
  onBannerChange,
  bannerInputRef,
}: ProfileBannerProps) {
  return (
    <div className="w-full h-36 rounded-b-3xl relative overflow-hidden">
      {bannerUrl ? (
        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-purple-400 via-pink-400 to-orange-400" />
      )}


      <button
        onClick={onBackClick}
        className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-black/10 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {isEditing && (
        <h1 className="absolute top-4 left-14 z-10 text-white font-bold text-lg">
          Edit Profile
        </h1>
      )}
      {isEditing && isOwnProfile && (
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute bottom-2 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white transition-colors"
        >
          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
            <path d="M20.71 7.04a1 1 0 000-1.41L18.37 3.29a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      )}

      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={onBannerChange}
        className="hidden"
      />
    </div>
  );
}

