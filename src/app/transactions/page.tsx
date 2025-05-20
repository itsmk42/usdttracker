'use client';

import { useState } from 'react';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';

export default function TransactionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      
      <div className="mb-8">
        <TransactionForm onSuccess={handleTransactionAdded} />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <TransactionList key={refreshKey} />
    </div>
  );
}
