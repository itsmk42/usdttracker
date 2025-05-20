# USDT Transaction Tracker

A web-based spreadsheet application for tracking USDT (Tether cryptocurrency) transactions. This application allows users to track buying and selling activities, calculate profits/losses, and visualize transaction data.

## Features

- **Transaction Tracking**: Record buying and selling activities with detailed information
- **Multi-User Support**: Secure login for multiple users to access and manage transactions
- **Profit/Loss Calculation**: Automatic calculation of profit and loss for each transaction
- **Data Visualization**: Charts and graphs to visualize performance over time
- **Responsive Design**: Access from any device with an internet connection

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd usdtlogs
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from the `supabase/schema.sql` file to set up the database schema
4. Get your Supabase URL and anon key from the API settings

### Step 4: Configure Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Update the `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy the application

## Usage

1. Create an account or log in
2. Add your USDT transactions (buy/sell)
3. View your transaction history and profit/loss calculations
4. Check the dashboard for performance metrics and visualizations
