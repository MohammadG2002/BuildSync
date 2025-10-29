import Button from "../../../components/common/Button";
import { Plus, Briefcase, Users } from "lucide-react";
import styles from "./Dashboard.module.css";

const QuickActions = ({ onNavigate }) => {
  return (
    <div className={styles.quickActions}>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => onNavigate("/app/workspaces")}
      >
        <Plus className="w-4 h-4" />
        Create Workspace
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => onNavigate("/app/workspaces")}
      >
        <Briefcase className="w-4 h-4" />
        New Project
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => onNavigate("/app/chat")}
      >
        <Users className="w-4 h-4" />
        Invite Members
      </Button>
    </div>
  );
};

export default QuickActions;
