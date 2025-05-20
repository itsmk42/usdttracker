'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Transaction } from '@/lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitLossChartProps {
  transactions: Transaction[];
}

export default function ProfitLossChart({ transactions }: ProfitLossChartProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Filter only sell transactions with profit/loss
    const sellTransactions = transactions
      .filter(t => t.transaction_type === 'sell' && t.profit_loss !== undefined)
      .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime());

    if (sellTransactions.length === 0) {
      setChartData({
        labels: ['No Data'],
        datasets: [
          {
            label: 'Profit/Loss',
            data: [0],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
      return;
    }

    // Calculate cumulative profit/loss
    let cumulativeProfitLoss = 0;
    const cumulativeData = sellTransactions.map(transaction => {
      cumulativeProfitLoss += transaction.profit_loss || 0;
      return cumulativeProfitLoss;
    });

    // Format dates for labels
    const labels = sellTransactions.map(transaction =>
      format(new Date(transaction.transaction_date), 'MMM d, yyyy')
    );

    setChartData({
      labels,
      datasets: [
        {
          label: 'Cumulative Profit/Loss (INR)',
          data: cumulativeData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
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
            weight: 'bold' // Make legend text bold for better visibility
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
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '₹' + context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: 'black', // Ensure y-axis labels are black
          callback: function(value: any) {
            return '₹' + value.toFixed(2);
          }
        }
      },
      x: {
        ticks: {
          color: 'black' // Ensure x-axis labels are black
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
