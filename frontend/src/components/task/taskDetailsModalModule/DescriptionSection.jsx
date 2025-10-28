import { Edit2, Save } from "lucide-react";

const DescriptionSection = ({
  description,
  isEditing,
  editedDescription,
  onEdit,
  onSave,
  onCancel,
  onChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Description
        </h3>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 min-h-[100px]"
            placeholder="Add a description..."
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={onSave}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {description || "No description provided."}
        </p>
      )}
    </div>
  );
};

export default DescriptionSection;
