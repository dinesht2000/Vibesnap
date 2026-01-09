import { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useCheckProfileExists,
  useCreateUserProfile,
} from "../hooks/useQueries";
import { uploadProfileImage } from "../firebase/storage";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshProfileStatus, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: profileExists = false, isLoading: isVerifyingProfile } =
    useCheckProfileExists(user?.uid, !!user);

  const createProfileMutation = useCreateUserProfile();

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerifyingProfile && profileExists) {
    return <Navigate to="/feed" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setError("");

    try {
      let profileImageUrl = "";
      if (profileImage) {
        profileImageUrl = await uploadProfileImage(user.uid, profileImage);
      }

      // Create user profile using TanStack Query mutation
      await createProfileMutation.mutateAsync({
        userId: user.uid,
        profile: {
          name: name.trim(),
          bio: bio.trim() || "",
          profileImageUrl,
        },
      });

      if (refreshProfileStatus) {
        await refreshProfileStatus();
      }

      navigate("/feed", { replace: true });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to save profile. Please try again.");
    }
  };

  if (isVerifyingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">Tell us a bit about yourself</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                {preview ? "Change Photo" : "Add Photo"}
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createProfileMutation.isPending}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={createProfileMutation.isPending}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createProfileMutation.isPending}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {createProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
