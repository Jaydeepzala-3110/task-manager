import { Edit, Trash2, MoreHorizontal, Calendar, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showAssignee?: boolean;
}

const TaskTable = ({ tasks, onEdit, onDelete, showAssignee = true }: TaskTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Task
              </th>
              {showAssignee && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Assignee
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{task.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{task.description}</div>
                  </div>
                </td>
                {showAssignee && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{task.assignee}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Flag size={16} className={`mr-2 ${getPriorityColor(task.priority)}`} />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(task)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-300 p-1 rounded transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-sm">No tasks found</div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
