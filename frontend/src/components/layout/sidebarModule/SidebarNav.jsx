import SidebarNavItem from "./SidebarNavItem";

const SidebarNav = ({ menuItems, currentWorkspace, collapsed }) => {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.name}
            item={item}
            currentWorkspace={currentWorkspace}
            collapsed={collapsed}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNav;
