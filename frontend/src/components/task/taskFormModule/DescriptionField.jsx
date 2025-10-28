const DescriptionField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description (Optional)
      </label>
      <textarea
        name="description"
        rows="4"
        placeholder="Add more details about this task..."
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
      />
    </div>
  );
};

export default DescriptionField;
