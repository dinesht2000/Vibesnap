interface ProfileInfoProps {
  name: string;
  bio?: string;
  isEditing: boolean;
  editName: string;
  editBio: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
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
  onCancel,
  isSaving,
}: ProfileInfoProps) {
  if (isEditing) {
    return (
      <div className="space-y-4 mb-8">
        <input
          type="text"
          value={editName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-xl font-bold"
          placeholder="Name"
        />
        <textarea
          value={editBio}
          onChange={(e) => onBioChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          rows={3}
          placeholder="Bio"
        />
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
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

