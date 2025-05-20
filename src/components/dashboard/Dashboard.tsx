'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, Transaction } from '@/lib/supabase';
import TransactionSummary from './TransactionSummary';
import ProfitLossChart from './ProfitLossChart';
import TransactionTypeChart from './TransactionTypeChart';

interface DashboardProps {
  userId?: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let userIdToUse = userId;

      // If userId is not provided as a prop, get it from the current session
      if (!userIdToUse) {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData.user) throw new Error('You must be logged in to view the dashboard');

        userIdToUse = userData.user.id;
      }

      const { data, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userIdToUse)
        .order('transaction_date', { ascending: true });

      if (transactionError) throw transactionError;

      // Calculate profit/loss for each transaction
      const transactionsWithProfitLoss = calculateProfitLoss(data || []);
      setTransactions(transactionsWithProfitLoss);
    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Calculate profit/loss based on transaction history
  const calculateProfitLoss = (transactions: Transaction[]): Transaction[] => {
    let runningBalance = 0;
    let totalCost = 0;
    let averageCost = 0;

    return transactions.map(transaction => {
      const { transaction_type, usdt_amount, total_value } = transaction;
      let profitLoss = 0;

      if (transaction_type === 'buy') {
        // Update running totals for buys
        totalCost += total_value;
        runningBalance += usdt_amount;
        averageCost = runningBalance > 0 ? totalCost / runningBalance : 0;
        profitLoss = 0; // No profit/loss on buy
      } else if (transaction_type === 'sell') {
        // Calculate profit/loss for sells based on average cost
        const costBasis = averageCost * usdt_amount;
        profitLoss = total_value - costBasis;

        // Update running totals
        runningBalance -= usdt_amount;
        totalCost = runningBalance > 0 ? averageCost * runningBalance : 0;
      }

      return {
        ...transaction,
        profit_loss: profitLoss,
      };
    });
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription for new transactions
    const subscription = supabase
      .channel('dashboard-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchTransactions]); // Re-fetch when userId changes

  if (loading) {
    return <div className="text-center py-4">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        Error: {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">No transactions found. Add transactions to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionSummary transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Profit/Loss Over Time</h3>
          <ProfitLossChart transactions={transactions} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Transaction Types</h3>
          <TransactionTypeChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
