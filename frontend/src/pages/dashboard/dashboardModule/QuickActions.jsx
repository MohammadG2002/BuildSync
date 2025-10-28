import Button from "../../../components/common/Button";
import { Plus, Briefcase, Users } from "lucide-react";

const QuickActions = ({ onNavigate }) => {
  return (
    <div className="space-y-2">
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
