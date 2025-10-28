import { Paperclip } from "lucide-react";
import FileUpload from "../../common/FileUpload";

const AttachmentsField = ({ showFileUpload, onToggle, onFilesSelected }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Attachments (Optional)
        </label>
        <button
          type="button"
          onClick={onToggle}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <Paperclip className="w-4 h-4" />
          {showFileUpload ? "Hide" : "Add Attachments"}
        </button>
      </div>

      {showFileUpload && (
        <FileUpload
          onFilesSelected={onFilesSelected}
          maxFiles={5}
          maxSize={10}
        />
      )}
    </div>
  );
};

export default AttachmentsField;
