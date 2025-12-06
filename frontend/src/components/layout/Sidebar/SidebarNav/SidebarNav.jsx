import SidebarNavItem from "../SidebarNavItem/SidebarNavItem";
import styles from "./SidebarNav.module.css";

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
