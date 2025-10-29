import { useRef } from "react";
import WorkspaceSelectorButton from "./WorkspaceSelectorButton";
import WorkspaceDropdown from "./WorkspaceDropdown";
import styles from "./Navbar.module.css";

const WorkspaceSelector = ({
  currentWorkspace,
  workspaces,
  showMenu,
  onToggleMenu,
  onSelect,
  onCreateNew,
  menuRef,
}) => {
  return (
    <div
      className={styles.workspaceContainer}
      ref={menuRef}
      data-onboarding="workspace-selector"
    >
      <WorkspaceSelectorButton
        currentWorkspace={currentWorkspace}
        onClick={onToggleMenu}
      />

      {showMenu && (
        <WorkspaceDropdown
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          onSelect={onSelect}
          onCreateNew={onCreateNew}
        />
      )}
    </div>
  );
};

export default WorkspaceSelector;
