import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            {import.meta.env.VITE_APP_NAME || "ProjectHub"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {subtitle}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {title && (
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              {title}
            </h2>
          )}
          {children}
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:text-gray-100 text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
