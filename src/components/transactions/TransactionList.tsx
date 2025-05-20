'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase, Transaction } from '@/lib/supabase';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error('You must be logged in to view transactions');

      const { data, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('transaction_date', { ascending: false });

      if (transactionError) throw transactionError;

      // Calculate profit/loss for each transaction
      const transactionsWithProfitLoss = calculateProfitLoss(data || []);
      setTransactions(transactionsWithProfitLoss);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Calculate profit/loss based on transaction history
  const calculateProfitLoss = (transactions: Transaction[]): Transaction[] => {
    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
    );

    let runningBalance = 0;
    let totalCost = 0;
    let averageCost = 0;

    return sortedTransactions.map(transaction => {
      const { transaction_type, usdt_amount, inr_price, total_value } = transaction;
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
    }).reverse(); // Reverse back to newest first for display
  };

  useEffect(() => {
    fetchTransactions();
    
    // Set up real-time subscription for new transactions
    const subscription = supabase
      .channel('transactions-changes')
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
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading transactions...</div>;
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
        <p className="text-gray-500">No transactions found. Add your first transaction above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              USDT Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price (INR)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profit/Loss
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.transaction_type === 'buy'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.transaction_type === 'buy' ? 'Buy' : 'Sell'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.usdt_amount.toFixed(6)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{transaction.inr_price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{transaction.total_value.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.transaction_type === 'sell' && transaction.profit_loss !== undefined ? (
                  <span
                    className={`${
                      transaction.profit_loss >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.profit_loss >= 0 ? '+' : ''}₹
                    {transaction.profit_loss.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
