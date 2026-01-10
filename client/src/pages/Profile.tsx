import { useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useUserProfile,
  useUserPosts,
  useUpdateUserProfile,
} from "../hooks/useQueries";
import { uploadProfileImage, uploadBannerImage } from "../firebase/storage";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = userId === user?.uid || (!userId && user);
  const targetUserId = userId || user?.uid;

  const { data: profile, isLoading: profileLoading } = useUserProfile(
    targetUserId,
    !!user
  );
  const { data: posts = [], isLoading: postsLoading } = useUserPosts(
    targetUserId,
    !!user
  );
  const updateProfileMutation = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editBannerImage, setEditBannerImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const loading = profileLoading || postsLoading;

  const displayName = isEditing ? editName : profile?.name || "";
  const displayBio = isEditing ? editBio : profile?.bio || "";
  const displayPreview =
    isEditing && preview ? preview : profile?.profileImageUrl || "";
  const displayBanner =
    isEditing && bannerPreview ? bannerPreview : profile?.bannerImageUrl || "";

  const handleEditClick = () => {
    if (profile) {
      setEditName(profile.name);
      setEditBio(profile.bio);
      setPreview(profile.profileImageUrl || "");
      setBannerPreview(profile.bannerImageUrl || "");
    }
    setIsEditing(true);
  };

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user || !isOwnProfile) return;

    if (!editName.trim()) {
      setError("Please enter your name");
      return;
    }

    setError("");

    try {
      let profileImageUrl = profile?.profileImageUrl || "";
      let bannerImageUrl = profile?.bannerImageUrl || "";

      if (editImage) {
        profileImageUrl = await uploadProfileImage(user.uid, editImage);
      }

      if (editBannerImage) {
        bannerImageUrl = await uploadBannerImage(user.uid, editBannerImage);
      }

      await updateProfileMutation.mutateAsync({
        userId: user.uid,
        updates: {
          name: editName.trim(),
          bio: editBio.trim(),
          profileImageUrl,
          bannerImageUrl,
        },
      });

      setIsEditing(false);
      setEditImage(null);
      setEditBannerImage(null);
      setPreview("");
      setBannerPreview("");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile. Please try again."
      );
    }
  };

  const handleCancel = () => {
    setEditImage(null);
    setEditBannerImage(null);
    setPreview("");
    setBannerPreview("");
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <button
            onClick={() => navigate("/feed")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm max-w-md">
          {error}
        </div>
      )}

      <div className="relative h-fit">
        <div className="w-full h-36 rounded-b-3xl relative overflow-hidden">
          {displayBanner ? (
            <img
              src={displayBanner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-400 via-pink-400 to-orange-400" />
          )}

          <button
            onClick={() => navigate("/feed")}
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-black/10 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {isEditing && isOwnProfile && (
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="absolute bottom-2 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="gray-200"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                <path d="M20.71 7.04a1 1 0 000-1.41L18.37 3.29a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          )}

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerImageChange}
            className="hidden"
          />
        </div>

        <div className="absolute -bottom-12 left-4 z-20">
          <div className="relative">
            {displayPreview ? (
              <img
                src={displayPreview}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover shadow-black/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-gray-600 text-3xl font-medium">
                  {displayName[0]?.toUpperCase()}
                </span>
              </div>
            )}
            {isEditing && isOwnProfile && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gray-900 text-white rounded-full p-1.5 hover:bg-gray-800 shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {!isEditing && isOwnProfile && (
          <div className="absolute -bottom-12 left-32 z-20">
            <button
              onClick={handleEditClick}
              className=" px-22 py-1.5 border border-gray-300 bg-white text-gray-900 rounded-full text-sm font-medium shadow-sm "
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <main className="pt-16 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {isEditing && isOwnProfile ? (
            <div className="space-y-4 mb-8">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-xl font-bold"
                placeholder="Name"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                rows={3}
                placeholder="Bio"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {displayName}
              </h1>
              {displayBio && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {displayBio}
                </p>
              )}
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">My Posts</h2>
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>No posts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-400 text-xs text-center px-2">
                          {post.content}
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-xs font-medium text-white mb-1 truncate">
                          {post.content.length > 15
                            ? `${post.content.substring(0, 15)}...`
                            : post.content}
                        </p>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs text-white font-medium">
                            0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isOwnProfile && (
        <button
          onClick={() => navigate("/feed")}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
          aria-label="Create new post"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
