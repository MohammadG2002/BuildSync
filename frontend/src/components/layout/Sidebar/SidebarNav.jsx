import SidebarNavItem from "./SidebarNavItem";
import styles from "./Sidebar.module.css";

const SidebarNav = ({ menuItems, currentWorkspace, collapsed }) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navList}>
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
