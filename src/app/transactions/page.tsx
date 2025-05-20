import { requireAuth } from '@/lib/auth';
import TransactionsClient from './transactions-client';

export const metadata = {
  title: 'Transactions - USDT Transaction Tracker',
  description: 'Manage your USDT transactions',
};

export default async function TransactionsPage() {
  // This will redirect to /auth if the user is not authenticated
  const session = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <p className="mb-4 text-gray-600">
        Welcome, {session.user.email}
      </p>

      <TransactionsClient userId={session.user.id} />
    </div>
  );
}
