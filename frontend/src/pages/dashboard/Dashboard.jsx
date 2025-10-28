import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { SkeletonStats, SkeletonList } from "../../components/common/Loader";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  StatCard,
  ProjectCard,
  TaskItem,
  DeadlineItem,
  QuickActions,
  CurrentWorkspaceCard,
} from "./dashboardModule";

const Dashboard = () => {
  const { user } = useAuth();
  const { workspaces, currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Mock stats (replace with real data from API)
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: Briefcase,
      color: "blue",
      change: "+2 this month",
      trend: "up",
    },
    {
      title: "Active Tasks",
      value: "45",
      icon: Clock,
      color: "yellow",
      change: "23 in progress",
      trend: "neutral",
    },
    {
      title: "Completed",
      value: "156",
      icon: CheckCircle,
      color: "green",
      change: "+18 this week",
      trend: "up",
    },
    {
      title: "Team Members",
      value: "8",
      icon: Users,
      color: "purple",
      change: "2 active now",
      trend: "neutral",
    },
  ];

  const recentProjects = [];
  const recentTasks = [];
  const upcomingDeadlines = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Projects Card */}
          <Card
            title="Recent Projects"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/workspaces")}
                className="gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            }
          >
            {loading ? (
              <SkeletonList count={3} />
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() =>
                      navigate(`/app/workspaces/1/projects/${project.id}`)
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
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full mt-4 gap-2"
              onClick={() => navigate("/app/workspaces")}
            >
              <Plus className="w-4 h-4" />
              Add New Task
            </Button>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card title="Upcoming Deadlines">
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
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
