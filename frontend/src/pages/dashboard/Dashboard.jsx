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
  StatusTrendChart,
  ProjectStatusChart,
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
  const [weeklyStatus, setWeeklyStatus] = useState({ labels: [], series: {} });
  const [projectStatus, setProjectStatus] = useState({
    labels: [],
    counts: {},
  });

  useEffect(() => {
    if (currentWorkspace) {
      fetchDashboardData(
        currentWorkspace,
        setStats,
        setProjects,
        setTasks,
        setDeadlines,
        setWeeklyStatus,
        setProjectStatus,
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
        {/* Left: Recent Projects and My Tasks */}
        <div className={styles.mainColumn}>
          {/* Recent Projects Card */}
          <Card
            title="Recent Projects"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate(`/app/workspaces/${currentWorkspace.id}`)
                }
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
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id || project._id || index}
                    project={project}
                    onClick={() =>
                      navigate(
                        `/app/workspaces/${currentWorkspace.id}/projects/${
                          project.id || project._id || ""
                        }`
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
                {tasks.map((task, index) => {
                  const projectId =
                    task?.project?.id ||
                    task?.project?._id ||
                    task?.projectId ||
                    "";
                  const taskId = task?._id || task?.id || "";
                  return (
                    <TaskItem
                      key={task.id || task._id || index}
                      task={task}
                      onClick={() => {
                        if (!projectId || !taskId) return;
                        navigate(
                          `/app/workspaces/${currentWorkspace.id}/projects/${projectId}?task=${taskId}`
                        );
                      }}
                    />
                  );
                })}
              </div>
            )}
            <Button
              variant="ghost"
              className={`w-full ${styles.addTaskButton} ${styles.addTaskButtonInner}`}
              onClick={() => navigate(`/app/workspaces/${currentWorkspace.id}`)}
            >
              <Plus className={styles.addTaskIcon} />
              Add New Task
            </Button>
          </Card>
        </div>

        {/* Right: Charts + Sidebar */}
        <div className={styles.sidebar}>
          {/* Task Status Changes (Sat - Fri) */}
          <Card title="Task Status Changes (This Week)">
            <StatusTrendChart data={weeklyStatus} />
          </Card>

          {/* Project Status Breakdown */}
          <Card title="Project Status Breakdown">
            <ProjectStatusChart data={projectStatus} />
          </Card>

          {/* Upcoming Deadlines */}
          <Card title="Upcoming Deadlines">
            <div className={styles.deadlinesContainer}>
              {deadlines.map((deadline, index) => (
                <DeadlineItem
                  key={deadline.id || deadline._id || index}
                  deadline={deadline}
                />
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
