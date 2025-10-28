import FeatureCard from "./FeatureCard";
import { featuresData } from "./data";

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 dark:text-gray-500">
            Powerful features to help your team work better together
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
