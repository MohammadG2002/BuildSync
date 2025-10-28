import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";

const Navigation = () => {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              {import.meta.env.VITE_APP_NAME || "ProjectHub"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
