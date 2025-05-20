import Dashboard from '@/components/dashboard/Dashboard';

export const metadata = {
  title: 'Dashboard - USDT Transaction Tracker',
  description: 'View your USDT transaction dashboard and performance metrics',
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
    </div>
  );
}
