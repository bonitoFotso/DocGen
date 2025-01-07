import { Card, ChevronUp, Users, Building2, FileText, GraduationCap } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Total Clients', value: '89', icon: Users, change: '+4.75%' },
    { name: 'Active Sites', value: '142', icon: Building2, change: '+12.5%' },
    { name: 'Documents', value: '256', icon: FileText, change: '+23.1%' },
    { name: 'Formations', value: '12', icon: GraduationCap, change: '+8.2%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <ChevronUp className="h-4 w-4" />
                  <span className="sr-only">Increased by</span>
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-lg bg-white shadow">
          {/* Add recent activity content here */}
        </div>
      </div>
    </div>
  );
}