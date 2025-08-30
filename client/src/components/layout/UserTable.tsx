import { Edit, Trash2, MoreHorizontal, Shield, User } from 'lucide-react';

interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  // Add safety checks
  if (!users || !Array.isArray(users)) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm">Invalid users data</div>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
      : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {users.filter(user => user && user._id && user.username).map((user) => (
              <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-medium">
                        {user.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.username || 'Unknown'}</div>
                      <div className="text-sm text-gray-400">{user.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {(user.role || 'member') === 'admin' ? (
                      <Shield size={16} className="text-purple-400 mr-2" />
                    ) : (
                      <User size={16} className="text-blue-400 mr-2" />
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role || 'member')}`}>
                      {user.role || 'member'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status || 'active')}`}>
                      {user.status || 'active'}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                                         {onEdit && (
                       <button
                         onClick={() => onEdit(user)}
                         className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                         title="Edit User"
                       >
                         <Edit size={16} />
                       </button>
                     )}
                     {onDelete && (
                       <button
                         onClick={() => onDelete(user._id)}
                         className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                         title="Delete User"
                       >
                         <Trash2 size={16} />
                       </button>
                     )}
                     <button className="text-gray-400 hover:text-gray-300 p-1 rounded transition-colors" title="More Options">
                       <MoreHorizontal size={16} />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm">No users found</div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
