'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Transaction } from '@/lib/supabase';
import { ChartData } from '@/types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface TransactionTypeChartProps {
  transactions: Transaction[];
}

export default function TransactionTypeChart({ transactions }: TransactionTypeChartProps) {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Count buy and sell transactions
    const buyCount = transactions.filter(t => t.transaction_type === 'buy').length;
    const sellCount = transactions.filter(t => t.transaction_type === 'sell').length;

    setChartData({
      labels: ['Buy', 'Sell'],
      datasets: [
        {
          data: [buyCount, sellCount],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'black', // Ensure legend labels are black
          font: {
            weight: 'bold' as const // Make legend text bold for better visibility
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light background for tooltip
        titleColor: 'black', // Black text for tooltip title
        bodyColor: 'black', // Black text for tooltip body
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label(tooltipItem: any) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            const total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
