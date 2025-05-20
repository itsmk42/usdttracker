'use client';

import { Transaction } from '@/lib/supabase';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export default function TransactionSummary({ transactions }: TransactionSummaryProps) {
  // Calculate total USDT balance
  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.transaction_type === 'buy') {
        return balance + transaction.usdt_amount;
      } else {
        return balance - transaction.usdt_amount;
      }
    }, 0);
  };

  // Calculate total investment (sum of buy transactions)
  const calculateTotalInvestment = () => {
    return transactions
      .filter(t => t.transaction_type === 'buy')
      .reduce((total, transaction) => total + transaction.total_value, 0);
  };

  // Calculate total sales (sum of sell transactions)
  const calculateTotalSales = () => {
    return transactions
      .filter(t => t.transaction_type === 'sell')
      .reduce((total, transaction) => total + transaction.total_value, 0);
  };

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    return transactions
      .filter(t => t.transaction_type === 'sell' && t.profit_loss !== undefined)
      .reduce((total, transaction) => total + (transaction.profit_loss || 0), 0);
  };

  const balance = calculateBalance();
  const totalInvestment = calculateTotalInvestment();
  const totalSales = calculateTotalSales();
  const totalProfitLoss = calculateTotalProfitLoss();

  // Calculate average buy price
  const calculateAverageBuyPrice = () => {
    const buyTransactions = transactions.filter(t => t.transaction_type === 'buy');
    const totalAmount = buyTransactions.reduce((sum, t) => sum + t.usdt_amount, 0);
    const totalValue = buyTransactions.reduce((sum, t) => sum + t.total_value, 0);
    
    return totalAmount > 0 ? totalValue / totalAmount : 0;
  };

  const averageBuyPrice = calculateAverageBuyPrice();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Current USDT Balance</h3>
        <p className="text-2xl font-bold mt-1">{balance.toFixed(6)} USDT</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
        <p className="text-2xl font-bold mt-1">₹{totalInvestment.toFixed(2)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
        <p className="text-2xl font-bold mt-1">₹{totalSales.toFixed(2)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Profit/Loss</h3>
        <p className={`text-2xl font-bold mt-1 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {totalProfitLoss >= 0 ? '+' : ''}₹{totalProfitLoss.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Average Buy Price</h3>
        <p className="text-2xl font-bold mt-1">₹{averageBuyPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}
