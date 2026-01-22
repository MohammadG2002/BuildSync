import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import TaskStatCard from "../../../../../components/projectDetails/TaskStatCard/TaskStatCard";
import styles from "./TaskStatsGrid.module.css";

/**
 * TaskStatsGrid Component
 * Displays task statistics cards (Total, To Do, In Progress, In Review, Done)
 */
const TaskStatsGrid = ({ taskStats }) => {
  return (
    <div className={styles.statsGrid}>
      <TaskStatCard
        label="Total"
        value={taskStats.total}
        icon={CheckCircle}
        color="gray"
      />
      <TaskStatCard
        label="To Do"
        value={taskStats.todo}
        icon={AlertCircle}
        color="gray"
      />
      <TaskStatCard
        label="In Progress"
        value={taskStats.inProgress}
        icon={Clock}
        color="blue"
      />
      <TaskStatCard
        label="In Review"
        value={taskStats.inReview}
        icon={AlertCircle}
        color="yellow"
      />
      <TaskStatCard
        label="Done"
        value={taskStats.done}
        icon={CheckCircle}
        color="green"
      />
    </div>
  );
};

export default TaskStatsGrid;
