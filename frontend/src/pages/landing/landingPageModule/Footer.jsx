const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 dark:text-gray-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">
          © 2024 {import.meta.env.VITE_APP_NAME || "ProjectHub"}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
