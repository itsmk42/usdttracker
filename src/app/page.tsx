import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Track Your USDT Transactions
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A simple and powerful tool to monitor your USDT cryptocurrency investments, track profits, and visualize your performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Track Transactions</h2>
          <p className="text-gray-600">
            Easily record your USDT buying and selling activities with detailed information.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Calculate Profits</h2>
          <p className="text-gray-600">
            Automatically calculate profit and loss for each transaction and overall performance.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Visualize Data</h2>
          <p className="text-gray-600">
            View charts and graphs to understand your investment performance over time.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg my-12">
        <h2 className="text-2xl font-semibold mb-4">Multi-User Access</h2>
        <p className="text-gray-600 mb-4">
          Share access with your partner or team members. Everyone can log in securely and track transactions together.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Secure authentication system</li>
          <li>Individual user accounts</li>
          <li>Shared transaction history</li>
          <li>Access from any device</li>
        </ul>
      </div>

      <div className="text-center py-8 border-t border-gray-200 mt-12">
        <p className="text-gray-500 text-sm">
          USDT Transaction Tracker - A secure way to monitor your cryptocurrency investments
        </p>
      </div>
    </div>
  );
}
