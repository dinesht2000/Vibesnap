interface ProfileInfoProps {
  name: string;
  bio?: string;
  isEditing: boolean;
  editName: string;
  editBio: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProfileInfo({
  name,
  bio,
  isEditing,
  editName,
  editBio,
  onNameChange,
  onBioChange,
  onSave,
  isSaving,
}: ProfileInfoProps) {
  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-0 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 bg-transparent"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => onBioChange(e.target.value)}
              className="w-full px-0 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-900 resize-none text-gray-900 bg-transparent"
              rows={4}
              placeholder="Bio"
            />
          </div>
        </div>
        <div className="mt-auto pt-6 pb-4">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium uppercase"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
      {bio && <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>}
    </div>
  );
}

