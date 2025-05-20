import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a Supabase client with cookie-based auth for browser usage
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

export type Transaction = {
  id: string;
  created_at: string;
  user_id: string;
  transaction_date: string;
  transaction_type: 'buy' | 'sell';
  usdt_amount: number;
  inr_price: number;
  total_value: number;
  profit_loss?: number;
};

export type Profile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name?: string;
};
