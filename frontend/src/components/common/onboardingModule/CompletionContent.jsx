import { Check } from "lucide-react";

const CompletionContent = ({ title, description }) => (
  <div className="text-center py-4">
    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default CompletionContent;
