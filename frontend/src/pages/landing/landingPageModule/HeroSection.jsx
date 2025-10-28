import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/common/Button";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Manage Projects with
          <span className="text-primary-600"> Ease</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-8 max-w-3xl mx-auto">
          The all-in-one project management platform that helps teams
          collaborate, organize, and deliver projects faster than ever before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button variant="primary" size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
