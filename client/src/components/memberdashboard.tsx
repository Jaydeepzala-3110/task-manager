import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks, clearError, deleteTask } from "../store/taskSlice";
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
import TaskForm from "./TaskForm";

const MemberDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading, error, meta } = useAppSelector((state) => state.tasks);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "todo" | "in-progress" | "done"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);

  useEffect(() => {
    // Fetch tasks when component mounts
    dispatch(fetchTasks({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    // Clear any errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "todo").length,
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setShowEditTask(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleCreateTask = () => {
    setShowCreateTask(true);
  };

  const handleCloseCreateTask = () => {
    setShowCreateTask(false);
  };

  const handleCloseEditTask = () => {
    setShowEditTask(false);
    setCurrentTask(null);
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
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <button 
                  onClick={handleCreateTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus size={20} />
                  <span>Create Task</span>
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

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
              
              {loading ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              ) : (
                <TaskTable
                  tasks={filteredTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  showAssignee={false}
                />
              )}
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
                    <span className="text-white text-xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {user?.username || 'Member User'}
                    </h3>
                    <p className="text-gray-400">{user?.email || 'member@example.com'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.username || 'memberuser'}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'member@example.com'}
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
      //   return (
      //     <div className="space-y-6">
      //       <h2 className="text-2xl font-bold text-white">Settings</h2>
      //       <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      //         <div className="space-y-6">
      //           <div>
      //             <h3 className="text-lg font-semibold text-white mb-4">
      //               Preferences
      //             </h3>
      //             <div className="space-y-4">
      //               <div className="flex items-center justify-between">
      //                 <span className="text-gray-300">Email Notifications</span>
      //                 <button className="w-12 h-6 bg-blue-600 rounded-full relative">
      //                   <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
      //                 </button>
      //               </div>
      //               <div className="flex items-center justify-between">
      //                 <span className="text-gray-300">Dark Mode</span>
      //                 <button className="w-12 h-6 bg-blue-600 rounded-full relative">
      //                   <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
      //                 </button>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   );

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

      {/* Create Task Modal */}
      {showCreateTask && (
        <TaskForm
          mode="create"
          onClose={handleCloseCreateTask}
        />
      )}

      {/* Edit Task Modal */}
      {showEditTask && currentTask && (
        <TaskForm
          mode="edit"
          task={currentTask}
          onClose={handleCloseEditTask}
        />
      )}
    </div>
  );
};

export default MemberDashboard;
