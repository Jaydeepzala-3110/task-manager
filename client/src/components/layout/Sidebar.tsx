import { 
  BarChart3, 
  Users, 
  ClipboardList, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole: 'admin' | 'member';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ isCollapsed, onToggle, userRole, activeTab, onTabChange }: SidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  
  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const memberNavItems = [
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : memberNavItems;

  return (
    <div className={`bg-black border-r border-gray-800 h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-semibold text-lg">Taskify</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase() || (userRole === 'admin' ? 'A' : 'M')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.username || (userRole === 'admin' ? 'Admin User' : 'Member User')}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email || (userRole === 'admin' ? 'Administrator' : 'Team Member')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
