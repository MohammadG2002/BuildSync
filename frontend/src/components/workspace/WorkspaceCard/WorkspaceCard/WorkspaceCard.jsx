import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceMenu from "../WorkspaceMenu/WorkspaceMenu";
import WorkspaceIcon from "../WorkspaceIcon/WorkspaceIcon";
import WorkspaceStats from "../WorkspaceStats/WorkspaceStats";
import styles from "./WorkspaceCard.module.css";

const WorkspaceCard = ({ workspace, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e) => {
    if (
      e.target.closest(".menu-button") ||
      e.target.closest(".menu-dropdown")
    ) {
      return;
    }
    navigate(`/app/workspaces/${workspace.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div ref={menuRef}>
        <WorkspaceMenu
          showMenu={showMenu}
          onToggle={() => setShowMenu(!showMenu)}
          onEdit={(w) => {
            onEdit(w);
            setShowMenu(false);
          }}
          onDelete={(w) => {
            onDelete(w);
            setShowMenu(false);
          }}
          workspace={workspace}
        />
      </div>

      <div className={styles.content}>
        <WorkspaceIcon />
        <div className={styles.contentArea}>
          <h3 className={styles.title}>{workspace.name}</h3>
          <p className={styles.description}>
            {workspace.description || "No description"}
          </p>
          <WorkspaceStats workspace={workspace} />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
