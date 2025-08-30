import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, clearError, deleteTask } from '../store/taskSlice';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Plus,
  BarChart3,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import StatCard from './layout/StatCard';
import TaskTable from './layout/TaskTable';
import UserTable from './layout/UserTable';
import ChartCard from './layout/ChartCard';
import TaskForm from './TaskForm';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading, error, meta } = useAppSelector((state) => state.tasks);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);

  useEffect(() => {
    // Fetch all tasks when component mounts (admin can see all tasks)
    dispatch(fetchTasks({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    // Clear any errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  // Mock users data for now
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      username: 'janesmith',
      email: 'jane@example.com',
      role: 'member',
      status: 'active',
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      username: 'mikejohnson',
      email: 'mike@example.com',
      role: 'member',
      status: 'inactive',
      createdAt: '2024-01-03'
    }
  ];

  const stats = {
    totalUsers: mockUsers.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    pendingTasks: tasks.filter(t => t.status === 'todo').length
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

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
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
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                description="Active users in the system"
                icon={Users}
                color="blue"
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                description="All tasks created"
                icon={ClipboardList}
                color="green"
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="Completed Tasks"
                value={stats.completedTasks}
                description="Successfully completed"
                icon={CheckCircle}
                color="green"
                trend={{ value: 15, isPositive: true }}
              />
              <StatCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                description="Awaiting completion"
                icon={Clock}
                color="yellow"
                trend={{ value: -5, isPositive: false }}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Task Completion Over Time"
                description="Weekly task completion trends"
                icon={TrendingUp}
              >
                <div className="h-64 bg-gray-800 rounded-lg flex items-end justify-center space-x-2 p-4">
                  <div className="w-8 bg-blue-500 rounded-t h-16"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-24"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-20"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-32"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-28"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-36"></div>
                  <div className="w-8 bg-blue-500 rounded-t h-40"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </ChartCard>

              <ChartCard
                title="User Growth"
                description="Monthly user registration"
                icon={UserPlus}
              >
                <div className="h-64 bg-gray-800 rounded-lg flex items-end justify-center space-x-2 p-4">
                  <div className="w-6 bg-green-500 rounded-t h-20"></div>
                  <div className="w-6 bg-green-500 rounded-t h-32"></div>
                  <div className="w-6 bg-green-500 rounded-t h-28"></div>
                  <div className="w-6 bg-green-500 rounded-t h-40"></div>
                  <div className="w-6 bg-green-500 rounded-t h-36"></div>
                  <div className="w-6 bg-green-500 rounded-t h-44"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </ChartCard>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Users</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus size={20} />
                <span>Add User</span>
              </button>
            </div>
            <UserTable
              users={mockUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Tasks</h2>
              <button 
                onClick={handleCreateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            ) : (
              <TaskTable
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Task Status Distribution"
                description="Breakdown of task statuses"
                icon={BarChart3}
              >
                <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {tasks.length > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                    </div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="User Activity"
                description="Daily active users"
                icon={TrendingUp}
              >
                <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
                    <div className="text-gray-400">Total Users</div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400">Admin settings and configuration options will be implemented here.</p>
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
        userRole="admin"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <Header
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        userRole="admin"
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      } pt-16`}>
        <div className="p-6">
          {renderContent()}
        </div>
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

export default AdminDashboard;
