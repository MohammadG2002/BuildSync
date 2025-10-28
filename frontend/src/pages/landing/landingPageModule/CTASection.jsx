import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/common/Button";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Join thousands of teams already using{" "}
          {import.meta.env.VITE_APP_NAME || "ProjectHub"} to manage their
          projects.
        </p>
        <Link to="/register">
          <Button variant="secondary" size="lg" className="gap-2">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
