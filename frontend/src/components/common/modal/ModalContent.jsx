const ModalContent = ({ children }) => {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
      {children}
    </div>
  );
};

export default ModalContent;
