const ModalBackdrop = ({ onClick }) => {
  return (
    <div
      className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
      onClick={onClick}
    />
  );
};

export default ModalBackdrop;
