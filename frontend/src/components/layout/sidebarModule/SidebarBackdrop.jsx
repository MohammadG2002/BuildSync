const SidebarBackdrop = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={onClose}
    />
  );
};

export default SidebarBackdrop;
