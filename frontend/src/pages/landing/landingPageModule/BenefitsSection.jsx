import { CheckCircle } from "lucide-react";
import { benefitsData } from "./data";

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Why teams choose {import.meta.env.VITE_APP_NAME || "ProjectHub"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-8">
              Join thousands of teams who have transformed their project
              management workflow with our intuitive platform.
            </p>
            <div className="space-y-4">
              {benefitsData.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl p-8 lg:p-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
