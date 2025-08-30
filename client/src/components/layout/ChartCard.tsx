import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const ChartCard = ({ title, description, icon: Icon, children, className = '' }: ChartCardProps) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Icon size={20} className="text-blue-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
