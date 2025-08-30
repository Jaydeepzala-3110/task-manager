import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard = ({ title, value, description, icon: Icon, trend, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      icon: 'text-blue-500',
      border: 'border-blue-500/20'
    },
    green: {
      bg: 'bg-green-500/10',
      icon: 'text-green-500',
      border: 'border-green-500/20'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      icon: 'text-yellow-500',
      border: 'border-yellow-500/20'
    },
    red: {
      bg: 'bg-red-500/10',
      icon: 'text-red-500',
      border: 'border-red-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-500',
      border: 'border-purple-500/20'
    }
  };

  const selectedColor = colorClasses[color];

  return (
    <div className={`bg-gray-900 border ${selectedColor.border} rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-3xl font-bold mb-2">{value}</p>
          {description && (
            <p className="text-gray-500 text-sm">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-gray-500 text-sm ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${selectedColor.bg}`}>
          <Icon size={24} className={selectedColor.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
