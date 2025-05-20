import { User } from '@supabase/supabase-js';

// Auth types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Error types
export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// Chart types
export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface Point {
  x: number;
  y: number;
}

export interface ChartTooltipItem {
  dataset: {
    label?: string;
    data: (number | Point | null)[];
  };
  label?: string;
  raw?: number;
  parsed: {
    y: number;
  };
}

// Cookie types
export interface CookieOptions {
  name: string;
  value: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}
