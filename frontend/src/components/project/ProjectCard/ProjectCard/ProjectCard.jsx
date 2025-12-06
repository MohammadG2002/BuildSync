import { useState, useRef, useEffect } from "react";
import calculateProgress from "../calculateProgress";
import ProjectMenu from "../ProjectMenu/ProjectMenu";
import ProjectHeader from "../ProjectHeader/ProjectHeader";
import ProjectProgress from "../ProjectProgress/ProjectProgress";
import ProjectStats from "../ProjectStats/ProjectStats";
import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
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
    onClick?.(project);
  };

  const progress = calculateProgress(project);

  return (
    <div className={styles.card} onClick={handleClick}>
      <div ref={menuRef}>
        <ProjectMenu
          showMenu={showMenu}
          onToggle={() => setShowMenu(!showMenu)}
          onEdit={(p) => {
            onEdit(p);
            setShowMenu(false);
          }}
          onDelete={(p) => {
            onDelete(p);
            setShowMenu(false);
          }}
          project={project}
        />
      </div>

      <ProjectHeader project={project} />
      <ProjectProgress progress={progress} />
      <ProjectStats project={project} />
    </div>
  );
};

export default ProjectCard;
