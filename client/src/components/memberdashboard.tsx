import { useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import StatCard from "./layout/StatCard";
import TaskTable from "./layout/TaskTable";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  createdAt: string;
}

const MemberDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in-progress" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with API calls later
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Complete project documentation",
      description: "Write comprehensive documentation for the new feature",
      status: "completed",
      priority: "high",
      assignee: "Current User",
      dueDate: "2024-01-15",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      title: "Review code changes",
      description: "Review pull request #123 for the authentication module",
      status: "in-progress",
      priority: "medium",
      assignee: "Current User",
      dueDate: "2024-01-20",
      createdAt: "2024-01-05",
    },
    {
      id: "3",
      title: "Update user profile",
      description: "Add new fields to user profile and update validation",
      status: "pending",
      priority: "low",
      assignee: "Current User",
      dueDate: "2024-01-25",
      createdAt: "2024-01-10",
    },
    {
      id: "4",
      title: "Fix navigation bug",
      description: "Resolve issue with mobile navigation menu",
      status: "pending",
      priority: "high",
      assignee: "Current User",
      dueDate: "2024-01-18",
      createdAt: "2024-01-12",
    },
  ];

  const filteredTasks = mockTasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: mockTasks.length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
    inProgress: mockTasks.filter((t) => t.status === "in-progress").length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
  };

  const handleEditTask = (task: Task) => {
    console.log("Edit task:", task);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log("Delete task:", taskId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Tasks"
                value={stats.total}
                description="Your assigned tasks"
                icon={ClipboardList}
                color="blue"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                description="Successfully completed"
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                description="Currently working on"
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                description="Awaiting start"
                icon={Clock}
                color="red"
              />
            </div>

            {/* Filters and Actions */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">
                      Filter:
                    </span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus size={20} />
                  <span>Create Task</span>
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Tasks</h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <TaskTable
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                showAssignee={false}
              />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">M</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Member User
                    </h3>
                    <p className="text-gray-400">member@example.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue="memberuser"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="member@example.com"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Email Notifications</span>
                      <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Dark Mode</span>
                      <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        userRole="member"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Header
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        userRole="member"
      />

      <main
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        } pt-16`}
      >
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
};

export default MemberDashboard;
