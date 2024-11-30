import EarningsCard from '@/components/EarningsCard';
import TransactionHistory from '@/components/TransactionHistory';

const AdminEarningsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Admin Earnings Dashboard</h1>
      <div className="grid gap-8">
        <EarningsCard/>
        <TransactionHistory />
      </div>
    </div>
  );
}

export default AdminEarningsPage;