import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red';
}

const colorMap = {
  green: 'bg-green-50 text-primary border-green-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  red: 'bg-red-50 text-red-500 border-red-100',
};

const iconBgMap = {
  green: 'bg-green-100 text-primary',
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-500',
};

export default function StatsCard({ icon: Icon, value, label, color = 'green' }: StatsCardProps) {
  return (
    <div className={`card-base p-5 border ${colorMap[color]}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgMap[color]}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium opacity-80">{label}</p>
        </div>
      </div>
    </div>
  );
}
