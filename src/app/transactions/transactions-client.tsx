'use client';

import { useState } from 'react';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';

interface TransactionsClientProps {
  userId: string;
}

export default function TransactionsClient({ userId }: TransactionsClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <div className="mb-8">
        <TransactionForm onSuccess={handleTransactionAdded} />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <TransactionList key={refreshKey} userId={userId} />
    </>
  );
}
