import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";

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

  // Mock recent projects
  const recentProjects = [
    {
      id: "1",
      name: "Website Redesign",
      workspace: "Design Team",
      progress: 65,
      status: "active",
      dueDate: "2024-12-15",
      members: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Development",
      workspace: "Development Team",
      progress: 40,
      status: "active",
      dueDate: "2024-12-30",
      members: [
        { id: "3", name: "Bob Johnson" },
        { id: "4", name: "Alice Williams" },
      ],
    },
    {
      id: "3",
      name: "Marketing Campaign",
      workspace: "Marketing Team",
      progress: 90,
      status: "active",
      dueDate: "2024-11-20",
      members: [{ id: "5", name: "Charlie Brown" }],
    },
  ];

  // Mock recent tasks
  const recentTasks = [
    {
      id: "1",
      title: "Update documentation",
      project: "Website Redesign",
      priority: "high",
      dueDate: "2024-10-30",
      completed: false,
    },
    {
      id: "2",
      title: "Review pull requests",
      project: "Mobile App Development",
      priority: "medium",
      dueDate: "2024-10-28",
      completed: false,
    },
    {
      id: "3",
      title: "Design system updates",
      project: "Website Redesign",
      priority: "low",
      dueDate: "2024-11-05",
      completed: true,
    },
  ];

  // Mock upcoming deadlines
  const upcomingDeadlines = [
    {
      id: "1",
      title: "Q4 Marketing Report",
      type: "project",
      dueDate: "2024-10-31",
      daysLeft: 4,
    },
    {
      id: "2",
      title: "Client Presentation",
      type: "task",
      dueDate: "2024-11-02",
      daysLeft: 6,
    },
    {
      id: "3",
      title: "Beta Release",
      type: "project",
      dueDate: "2024-11-15",
      daysLeft: 19,
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const priorityColors = {
    low: "text-gray-600",
    medium: "text-blue-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {stat.trend === "up" && (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    colorClasses[stat.color]
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

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
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/app/workspaces/1/projects/${project.id}`)
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {project.workspace}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {project.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Members and Due Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.members.map((member) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                          style={{
                            backgroundColor: generateColor(member.name),
                          }}
                          title={member.name}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Due {formatDate(project.dueDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Tasks Card */}
          <Card title="My Tasks">
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium text-gray-900 ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">{task.project}</p>
                      <span
                        className={`text-xs font-medium ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <div
                  key={deadline.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {deadline.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        deadline.daysLeft <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {deadline.daysLeft}d
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(deadline.dueDate)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{deadline.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/workspaces")}
              >
                <Plus className="w-4 h-4" />
                Create Workspace
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/workspaces")}
              >
                <Briefcase className="w-4 h-4" />
                New Project
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/app/chat")}
              >
                <Users className="w-4 h-4" />
                Invite Members
              </Button>
            </div>
          </Card>

          {/* Current Workspace */}
          {currentWorkspace && (
            <Card title="Active Workspace">
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {currentWorkspace.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {currentWorkspace.memberCount || 0} members
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-3 gap-2"
                onClick={() => navigate("/app/workspaces")}
              >
                Switch Workspace
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
