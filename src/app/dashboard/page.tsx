import Dashboard from '@/components/dashboard/Dashboard';
import { requireAuth } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard - USDT Transaction Tracker',
  description: 'View your USDT transaction dashboard and performance metrics',
};

export default async function DashboardPage() {
  // This will redirect to /auth if the user is not authenticated
  const session = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Welcome, {session.user.email}
      </p>
      <Dashboard />
    </div>
  );
}
