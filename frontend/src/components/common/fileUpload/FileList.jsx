import FileListItem from "./FileListItem";

const FileList = ({ files, onRemove, onPreview }) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <FileListItem
          key={index}
          file={file}
          index={index}
          onRemove={onRemove}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default FileList;
