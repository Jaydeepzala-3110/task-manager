import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  userRole: 'admin' | 'member';
}

const Header = ({ isCollapsed, onToggleSidebar, userRole }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`bg-black border-b border-gray-800 h-16 fixed top-0 right-0 z-40 transition-all duration-300 ${
      isCollapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userRole === 'admin' ? 'A' : 'M'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">
                  {userRole === 'admin' ? 'Admin User' : 'Member User'}
                </p>
                <p className="text-gray-400 text-xs">
                  {userRole === 'admin' ? 'Administrator' : 'Team Member'}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <User size={16} className="mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                    <Settings size={16} className="mr-3" />
                    Settings
                  </button>
                  <hr className="border-gray-700 my-1" />
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors">
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
