import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Login or Sign Up - USDT Transaction Tracker',
  description: 'Login or create an account to track your USDT transactions',
};

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold text-center mb-8">
        Login or Create an Account
      </h1>
      <AuthForm />
    </div>
  );
}
