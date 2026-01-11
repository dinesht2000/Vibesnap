import { useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile, useUserPosts, useUpdateUserProfile, useDeletePost } from "../hooks/useQueries";
import { uploadProfileImage, uploadBannerImage } from "../firebase/storage";
import {
  ErrorToast,
  LoadingState,
  EmptyState,
  ProfileBanner,
  ProfilePicture,
  ProfileEditButton,
  ProfileInfo,
  ProfilePostsGrid,
} from "../components/profile";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = Boolean(userId === user?.uid || (!userId && user));
  const targetUserId = userId || user?.uid;

  const { data: profile, isLoading: profileLoading } = useUserProfile(targetUserId, !!user);
  const { data: posts = [], isLoading: postsLoading } = useUserPosts(targetUserId, !!user);
  const updateProfileMutation = useUpdateUserProfile();
  const deletePostMutation = useDeletePost();

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

  // Use profile data directly when not editing, local state when editing
  const displayName = isEditing ? editName : profile?.name || "";
  const displayBio = isEditing ? editBio : profile?.bio || "";
  const displayPreview = isEditing && preview ? preview : profile?.profileImageUrl || "";
  const displayBanner = isEditing && bannerPreview ? bannerPreview : profile?.bannerImageUrl || "";

  // Initialize edit form when entering edit mode
  const handleEditClick = () => {
    if (profile) {
      setEditName(profile.name);
      setEditBio(profile.bio);
      setPreview(profile.profileImageUrl || "");
      setBannerPreview(profile.bannerImageUrl || "");
    }
    setIsEditing(true);
  };

  // Redirect if no user (wait for auth to finish loading)
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

      // Upload new profile image if selected
      if (editImage) {
        profileImageUrl = await uploadProfileImage(user.uid, editImage);
      }

      // Upload new banner image if selected
      if (editBannerImage) {
        bannerImageUrl = await uploadBannerImage(user.uid, editBannerImage);
      }

      // Update profile using mutation
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
      setError(err instanceof Error ? err.message : "Failed to save profile. Please try again.");
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

  const handleDeletePost = async (postId: string) => {
    if (!user || !isOwnProfile || !targetUserId) return;

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        setError("Post not found");
        return;
      }

      await deletePostMutation.mutateAsync({
        userId: targetUserId,
        postId,
        post,
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <EmptyState
        message="Profile not found"
        buttonText="Go to Feed"
        onButtonClick={() => navigate("/feed")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {error && <ErrorToast error={error} />}

      {/* Banner Section */}
      <div className="relative h-fit">
        <ProfileBanner
          bannerUrl={displayBanner}
          isEditing={isEditing}
          isOwnProfile={isOwnProfile}
          onBackClick={() => navigate("/feed")}
          onBannerChange={handleBannerImageChange}
          bannerInputRef={bannerInputRef}
        />

        <ProfilePicture
          imageUrl={displayPreview}
          name={displayName}
          isEditing={isEditing}
          isOwnProfile={isOwnProfile}
          onImageChange={handleImageChange}
          fileInputRef={fileInputRef}
        />

        {!isEditing && isOwnProfile && <ProfileEditButton onEditClick={handleEditClick} />}
      </div>
      {/* Profile Content */}
      <main className="pt-16 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <ProfileInfo
            name={displayName}
            bio={displayBio}
            isEditing={isEditing && isOwnProfile}
            editName={editName}
            editBio={editBio}
            onNameChange={setEditName}
            onBioChange={setEditBio}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={updateProfileMutation.isPending}
          />

          {/* My Posts Section */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">My Posts</h2>
            <ProfilePostsGrid 
              posts={posts} 
              isOwnProfile={isOwnProfile}
              onDelete={handleDeletePost}
              isDeleting={deletePostMutation.isPending}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {isOwnProfile && (
        <button
          onClick={() => navigate("/create-post")}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
          aria-label="Create new post"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}

