import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, clearError } from '../store/taskSlice';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Plus,
  BarChart3,
  TrendingUp,
  UserPlus,
  Shield
} from 'lucide-react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import StatCard from './layout/StatCard';
import UserTable from './layout/UserTable';
import ChartCard from './layout/ChartCard';
import TaskForm from './TaskForm';
import TaskAssignmentModal from './TaskAssignmentModal';
import UserRoleUpdateModal from './UserRoleUpdateModal';
import UserEditModal from './UserEditModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import CreateUserModal from './CreateUserModal';
import UserSearchFilter from './UserSearchFilter';
import TaskSearchFilter from './TaskSearchFilter';
import adminService from '../services/adminService';

interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading: tasksLoading, error } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showUserRoleUpdate, setShowUserRoleUpdate] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminTasks, setAdminTasks] = useState<any[]>([]);
  const [dashboardOverview, setDashboardOverview] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  
  // Search and filter states
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [userFilters, setUserFilters] = useState<any>({});
  const [taskFilters, setTaskFilters] = useState<any>({});
  const [userSort, setUserSort] = useState({ field: 'createdAt', order: 'desc' });
  const [taskSort, setTaskSort] = useState({ field: 'createdAt', order: 'desc' });

  useEffect(() => {
    // Fetch all tasks when component mounts (admin can see all tasks)
    dispatch(fetchTasks({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    // Clear any errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Fetch admin dashboard data when activeTab changes
    if (activeTab === 'overview') {
      fetchDashboardOverview();
    } else if (activeTab === 'users') {
      fetchAdminUsers();
    } else if (activeTab === 'tasks') {
      fetchAdminTasks();
    } else if (activeTab === 'members') {
      fetchAdminUsers();
    }
  }, [activeTab]);

  const fetchDashboardOverview = async () => {
    setAdminLoading(true);
    try {
      const response = await adminService.getDashboardOverview();
      if (response.success && response.data) {
        setDashboardOverview(response.data);
      } else {
        setDashboardOverview(null);
        console.error('Invalid dashboard data received:', response);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      setDashboardOverview(null);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    try {
      const response = await adminService.getAllUsersForAdmin({ limit: 100 });
      if (response.success && response.data && Array.isArray(response.data.users)) {
        setAdminUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } else {
        setAdminUsers([]);
        setFilteredUsers([]);
        console.error('Invalid users data received:', response);
      }
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      setAdminUsers([]);
      setFilteredUsers([]);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchAdminTasks = async () => {
    setAdminLoading(true);
    try {
      const response = await adminService.getAllTasksForAdmin({ limit: 100 });
      if (response.success && response.data && Array.isArray(response.data.tasks)) {
        setAdminTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      } else {
        setAdminTasks([]);
        setFilteredTasks([]);
        console.error('Invalid tasks data received:', response);
      }
    } catch (error) {
      console.error('Failed to fetch admin tasks:', error);
      setAdminTasks([]);
      setFilteredTasks([]);
    } finally {
      setAdminLoading(false);
    }
  };

  // Mock users data for nowx
 

  const stats = {
    totalUsers: dashboardOverview?.totalUsers || 0,
    totalTasks: dashboardOverview?.totalTasks || tasks.length,
    completedTasks: dashboardOverview?.tasksByStatus?.find((s: any) => s.status === 'done')?.count || tasks.filter(t => t.status === 'done').length,
    pendingTasks: dashboardOverview?.tasksByStatus?.find((s: any) => s.status === 'todo')?.count || tasks.filter(t => t.status === 'todo').length
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setShowEditTask(true);
  };


  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowUserEdit(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = adminUsers.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      const response = await adminService.deleteUserAdmin(currentUser._id);
      if (response.success) {
        fetchAdminUsers();
        if (activeTab === 'overview') {
          fetchDashboardOverview();
        }
      } else {
        alert('Failed to delete user: ' + response.message);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleAssignTask = (task: any) => {
    setCurrentTask(task);
    setShowTaskAssignment(true);
  };

  const handleUpdateUserRole = (user: User) => {
    setCurrentUser(user);
    setShowUserRoleUpdate(true);
  };

  const handleTaskAssignmentSuccess = () => {
    fetchAdminTasks();
    dispatch(fetchTasks({ page: 1, limit: 10 }));
  };

  const handleUserRoleUpdateSuccess = () => {
    fetchAdminUsers();
  };

  const handleUserEditSuccess = () => {
    fetchAdminUsers();
    // Also refresh dashboard overview if on overview tab
    if (activeTab === 'overview') {
      fetchDashboardOverview();
    }
  };

  const handleUserCreated = () => {
    fetchAdminUsers();
    // Also refresh dashboard overview if on overview tab
    if (activeTab === 'overview') {
      fetchDashboardOverview();
    }
  };

  // User search and filter handlers
  const handleUserSearch = (searchTerm: string) => {
    setUserSearchTerm(searchTerm);
    applyUserFilters(searchTerm, userFilters, userSort);
  };

  const handleUserFilter = (filters: any) => {
    setUserFilters(filters);
    applyUserFilters(userSearchTerm, filters, userSort);
  };

  const handleUserSort = (field: string, order: 'asc' | 'desc') => {
    setUserSort({ field, order });
    applyUserFilters(userSearchTerm, userFilters, { field, order });
  };

  const handleUserClear = () => {
    setUserSearchTerm('');
    setUserFilters({});
    setUserSort({ field: 'createdAt', order: 'desc' });
    setFilteredUsers(adminUsers);
  };

  // Task search and filter handlers
  const handleTaskSearch = (searchTerm: string) => {
    setTaskSearchTerm(searchTerm);
    applyTaskFilters(searchTerm, taskFilters, taskSort);
  };

  const handleTaskFilter = (filters: any) => {
    setTaskFilters(filters);
    applyTaskFilters(taskSearchTerm, filters, taskSort);
  };

  const handleTaskSort = (field: string, order: 'asc' | 'desc') => {
    setTaskSort({ field, order });
    applyTaskFilters(taskSearchTerm, taskFilters, { field, order });
  };

  const handleTaskClear = () => {
    setTaskSearchTerm('');
    setTaskFilters({});
    setTaskSort({ field: 'createdAt', order: 'desc' });
    setFilteredTasks(adminTasks);
  };

  // Apply user filters
  const applyUserFilters = (searchTerm: string, filters: any, sort: any) => {
    let filtered = [...adminUsers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter(user => {
        const userDate = new Date(user.createdAt);
        switch (filters.dateRange) {
          case 'today':
            return userDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return userDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return userDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return userDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return userDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field as keyof User];
      let bValue: any = b[sort.field as keyof User];

      if (sort.field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  };

  // Apply task filters
  const applyTaskFilters = (searchTerm: string, filters: any, sort: any) => {
    let filtered = [...adminTasks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Assignee filter
    if (filters.assignee) {
      if (filters.assignee === 'unassigned') {
        filtered = filtered.filter(task => !task.assignee);
      } else if (filters.assignee === 'me') {
        // Filter by current user ID
        filtered = filtered.filter(task => task.assignee?._id === user?._id);
      }
    }

    // Created by filter
    if (filters.createdBy === 'me') {
      filtered = filtered.filter(task => task.createdBy?._id === user?._id);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        
        switch (filters.dateRange) {
          case 'today':
            return dueDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return dueDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return dueDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return dueDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return dueDate >= yearAgo;
          case 'overdue':
            return dueDate < now && task.status !== 'done';
          case 'due-soon':
            const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            return dueDate <= threeDaysFromNow && dueDate >= now;
          default:
            return true;
        }
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags?.some((tag: string) => filters.tags.includes(tag))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];

      if (sort.field === 'createdAt' || sort.field === 'dueDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTasks(filtered);
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
            {adminLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={dashboardOverview?.totalUsers || 0}
                description="Active users in the system"
                icon={Users}
                color="blue"
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Total Tasks"
                value={dashboardOverview?.totalTasks || 0}
                description="All tasks created"
                icon={ClipboardList}
                color="green"
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                title="Completed Tasks"
                value={dashboardOverview?.completedTasks || 0}
                description="Successfully completed"
                icon={CheckCircle}
                color="green"
                trend={{ value: 15, isPositive: true }}
              />
              <StatCard
                title="Pending Tasks"
                value={dashboardOverview?.pendingTasks || 0}
                description="Awaiting completion"
                icon={Clock}
                color="yellow"
                trend={{ value: -5, isPositive: false }}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Recent Tasks"
                description="Latest task activities"
                icon={TrendingUp}
              >
                <div className="space-y-3">
                  {dashboardOverview?.recentTasks?.slice(0, 5).map((task: any, index: number) => {
                    if (!task || !task.title) return null;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="text-sm text-white font-medium">{task.title || 'Untitled'}</div>
                            <div className="text-xs text-gray-400">
                              Assigned to {task.assignee?.username || 'Unassigned'}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (task.status || 'todo') === 'done' ? 'bg-green-600 text-white' :
                          (task.status || 'todo') === 'in-progress' ? 'bg-blue-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {task.status || 'todo'}
                        </span>
                      </div>
                    );
                  })}
                  {(!dashboardOverview?.recentTasks || dashboardOverview.recentTasks.length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      No recent tasks
                    </div>
                  )}
                </div>
              </ChartCard>

              <ChartCard
                title="Recent Users"
                description="Latest user registrations"
                icon={UserPlus}
              >
                <div className="space-y-3">
                  {dashboardOverview?.recentUsers?.slice(0, 5).map((user: any, index: number) => {
                    if (!user || !user.username) return null;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.username?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                                                      <div>
                              <div className="text-sm text-white font-medium">{user.username || 'Unknown'}</div>
                              <div className="text-xs text-gray-400">{user.email || 'No email'}</div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (user.role || 'member') === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {user.role || 'member'}
                        </span>
                      </div>
                    );
                  })}
                  {(!dashboardOverview?.recentUsers || dashboardOverview.recentUsers.length === 0) && (
                    <div className="text-center py-8 text-gray-400">
                      No recent users
                    </div>
                  )}
                </div>
              </ChartCard>
            </div>
              </>
            )}
          </div>
        );

             case 'users':
         return (
           <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-white">Users</h2>
               <button 
                 onClick={() => setShowCreateUser(true)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
               >
                 <Plus size={20} />
                 <span>Add User</span>
               </button>
             </div>
             
             {/* Search and Filter */}
             <UserSearchFilter
               onSearch={handleUserSearch}
               onFilter={handleUserFilter}
               onSort={handleUserSort}
               onClear={handleUserClear}
             />
             
             {adminLoading ? (
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                 <div className="flex items-center justify-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 </div>
               </div>
             ) : filteredUsers && filteredUsers.length > 0 ? (
               <UserTable
                 users={filteredUsers}
                 onEdit={handleEditUser}
                 onDelete={handleDeleteUser}
               />
             ) : (
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                 <div className="text-center py-12">
                   <div className="text-gray-400 text-sm">
                     {adminUsers.length > 0 ? 'No users match your search criteria' : 'No users found'}
                   </div>
                 </div>
               </div>
             )}
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

             {/* Search and Filter */}
             <TaskSearchFilter
               onSearch={handleTaskSearch}
               onFilter={handleTaskFilter}
               onSort={handleTaskSort}
               onClear={handleTaskClear}
             />

             {/* Error Display */}
             {error && (
               <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                 <p className="text-red-400">{error}</p>
               </div>
             )}

             {tasksLoading || adminLoading ? (
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                 <div className="flex items-center justify-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 </div>
               </div>
             ) : filteredTasks && filteredTasks.length > 0 ? (
               <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead className="bg-gray-800">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Task
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Assignee
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Status
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Priority
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Due Date
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                           Actions
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-gray-900 divide-y divide-gray-800">
                       {filteredTasks.filter(task => task && task._id && task.title).map((task) => (
                         <tr key={task._id} className="hover:bg-gray-800">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm font-medium text-white">{task.title || 'Untitled'}</div>
                               <div className="text-sm text-gray-400">{task.description || 'No description'}</div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                                 <span className="text-white text-xs font-medium">
                                   {task.assignee?.username?.charAt(0)?.toUpperCase() || '?'}
                                 </span>
                               </div>
                               <span className="text-sm text-gray-300">
                                 {task.assignee?.username || 'Unassigned'}
                               </span>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 text-xs rounded-full ${
                               (task.status || 'todo') === 'done' ? 'bg-green-600 text-white' :
                               (task.status || 'todo') === 'in-progress' ? 'bg-blue-600 text-white' :
                               'bg-yellow-600 text-white'
                             }`}>
                               {task.status || 'todo'}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 py-1 text-xs rounded-full ${
                               (task.priority || 'low') === 'critical' ? 'bg-red-600 text-white' :
                               (task.priority || 'low') === 'high' ? 'bg-orange-600 text-white' :
                               (task.priority || 'low') === 'medium' ? 'bg-yellow-600 text-white' :
                               'bg-gray-600 text-white'
                             }`}>
                               {task.priority || 'low'}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                             {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <div className="flex items-center space-x-2">
                               <button
                                 onClick={() => handleAssignTask(task)}
                                 className="text-blue-400 hover:text-blue-300 transition-colors"
                               >
                                 Assign
                               </button>
                               <button
                                 onClick={() => handleEditTask(task)}
                                 className="text-green-400 hover:text-green-300 transition-colors"
                               >
                                 Edit
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             ) : (
               <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                 <div className="text-center py-12">
                   <div className="text-gray-400 text-sm">
                     {adminTasks.length > 0 ? 'No tasks match your search criteria' : 'No tasks found'}
                   </div>
                 </div>
               </div>
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
                      {tasks.length > 0 ? Math.round(((dashboardOverview?.completedTasks || 0) / (dashboardOverview?.totalTasks || 1)) * 100) : 0}%
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
                    <div className="text-3xl font-bold text-white mb-2">{dashboardOverview?.totalUsers || 0}</div>
                    <div className="text-gray-400">Total Users</div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Member Management</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="text-blue-500" size={24} />
                  <span className="text-blue-500 font-medium">Role Management</span>
                </div>
                <button 
                  onClick={() => setShowCreateUser(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus size={20} />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
            
                        {adminLoading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                                             {filteredUsers.filter(user => user && user._id && user.username).map((user) => (
                        <tr key={user._id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.username?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.username || 'Unknown'}</div>
                                <div className="text-sm text-gray-400">{user.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              (user.role || 'member') === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              {user.role || 'member'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              (user.status || 'active') === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                              {user.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleUpdateUserRole(user)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Update Role
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="text-center py-12">
                  <div className="text-gray-400 text-sm">No users found</div>
                </div>
              </div>
            )}
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

      {/* Task Assignment Modal */}
      {showTaskAssignment && currentTask && (
        <TaskAssignmentModal
          isOpen={showTaskAssignment}
          onClose={() => setShowTaskAssignment(false)}
          task={currentTask}
          onAssignmentSuccess={handleTaskAssignmentSuccess}
        />
      )}

      {/* User Role Update Modal */}
      {showUserRoleUpdate && currentUser && (
        <UserRoleUpdateModal
          isOpen={showUserRoleUpdate}
          onClose={() => setShowUserRoleUpdate(false)}
          user={currentUser}
          onUpdateSuccess={handleUserRoleUpdateSuccess}
        />
      )}

      {/* User Edit Modal */}
      {showUserEdit && currentUser && (
        <UserEditModal
          isOpen={showUserEdit}
          onClose={() => setShowUserEdit(false)}
          user={currentUser}
          onUpdateSuccess={handleUserEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && currentUser && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={confirmDeleteUser}
          title="Delete User"
          message="Are you sure you want to delete this user?"
          itemName={currentUser.username}
        />
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUserModal
          isOpen={showCreateUser}
          onClose={() => setShowCreateUser(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
