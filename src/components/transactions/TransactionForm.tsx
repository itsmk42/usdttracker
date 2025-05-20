'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const transactionSchema = z.object({
  transaction_date: z.string().nonempty('Date is required'),
  transaction_type: z.enum(['buy', 'sell'], {
    required_error: 'Please select a transaction type',
  }),
  usdt_amount: z.coerce
    .number()
    .positive('Amount must be positive')
    .min(0.000001, 'Amount must be at least 0.000001'),
  inr_price: z.coerce
    .number()
    .positive('Price must be positive'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_type: 'buy',
      usdt_amount: undefined,
      inr_price: undefined,
    },
  });

  const watchAmount = watch('usdt_amount') || 0;
  const watchPrice = watch('inr_price') || 0;
  const totalValue = watchAmount * watchPrice;

  const onSubmit = async (data: TransactionFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error('You must be logged in to add transactions');

      const { error: transactionError } = await supabase.from('transactions').insert({
        user_id: userData.user.id,
        transaction_date: data.transaction_date,
        transaction_type: data.transaction_type,
        usdt_amount: data.usdt_amount,
        inr_price: data.inr_price,
        total_value: data.usdt_amount * data.inr_price,
      });

      if (transactionError) throw transactionError;

      reset();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="transaction_date"
              type="date"
              {...register('transaction_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.transaction_date && (
              <p className="mt-1 text-sm text-red-600">{errors.transaction_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="transaction_type"
              {...register('transaction_type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            {errors.transaction_type && (
              <p className="mt-1 text-sm text-red-600">{errors.transaction_type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="usdt_amount" className="block text-sm font-medium text-gray-700 mb-1">
              USDT Amount
            </label>
            <input
              id="usdt_amount"
              type="number"
              step="0.000001"
              {...register('usdt_amount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.usdt_amount && (
              <p className="mt-1 text-sm text-red-600">{errors.usdt_amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="inr_price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (INR)
            </label>
            <input
              id="inr_price"
              type="number"
              step="0.01"
              {...register('inr_price')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.inr_price && (
              <p className="mt-1 text-sm text-red-600">{errors.inr_price.message}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium text-gray-700">
            Total Value: ₹{totalValue.toFixed(2)} INR
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
