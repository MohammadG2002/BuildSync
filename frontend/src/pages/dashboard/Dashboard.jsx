import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { SkeletonStats, SkeletonList } from "../../components/common/Loader";
import { ArrowRight, Plus } from "lucide-react";
import {
  StatCard,
  ProjectCard,
  TaskItem,
  DeadlineItem,
  QuickActions,
  CurrentWorkspaceCard,
} from "../../components/dashboard";
import fetchDashboardData from "../../utils/dashboard/fetchDashboardData";
import styles from "../../components/dashboard/Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { workspaces, currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchDashboardData(
        currentWorkspace,
        setStats,
        setProjects,
        setTasks,
        setDeadlines,
        setLoading
      );
    }
  }, [currentWorkspace]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className={styles.subtitle}>
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Projects - Takes 2 columns */}
        <div className={styles.mainColumn}>
          {/* Recent Projects Card */}
          <Card
            title="Recent Projects"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/workspaces")}
                className={styles.viewAllButton}
              >
                View All
                <ArrowRight className={styles.viewAllIcon} />
              </Button>
            }
          >
            {loading ? (
              <SkeletonList count={3} />
            ) : (
              <div className={styles.projectsContainer}>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() =>
                      navigate(
                        `/app/workspaces/${currentWorkspace.id}/projects/${project.id}`
                      )
                    }
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Recent Tasks Card */}
          <Card title="My Tasks">
            {loading ? (
              <SkeletonList count={4} />
            ) : (
              <div className={styles.tasksContainer}>
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              className={`w-full ${styles.addTaskButton} ${styles.addTaskButtonInner}`}
              onClick={() => navigate("/app/workspaces")}
            >
              <Plus className={styles.addTaskIcon} />
              Add New Task
            </Button>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className={styles.sidebar}>
          {/* Upcoming Deadlines */}
          <Card title="Upcoming Deadlines">
            <div className={styles.deadlinesContainer}>
              {deadlines.map((deadline) => (
                <DeadlineItem key={deadline.id} deadline={deadline} />
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <QuickActions onNavigate={navigate} />
          </Card>

          {/* Current Workspace */}
          <Card title="Active Workspace">
            <CurrentWorkspaceCard
              workspace={currentWorkspace}
              onSwitch={() => navigate("/app/workspaces")}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
