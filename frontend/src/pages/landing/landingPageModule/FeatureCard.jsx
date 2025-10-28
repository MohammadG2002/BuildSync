const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
