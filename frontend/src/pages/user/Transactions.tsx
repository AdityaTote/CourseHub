import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";
import { useRecoilState } from "recoil";
import { userTransactionAtom } from "@/store/atom";
import { useEffect } from "react";
import { TransactionHistorySkeleton } from "@/components/TransactionHistorySkeleton";
import { UserTransactions } from "@/types";
import { Layout } from "@/components/Layout";
import useUserAuth from "@/hooks/useUserAuth";
import { useNavigate } from "react-router-dom";

const Transactions: React.FC = () => {
  const { data, error, loading } = useFetch(
    `${BACKEND_URL}/api/v1/user/transactions`,
    true
  );
  const [transactions, setTransactions] = useRecoilState(userTransactionAtom);
  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    navigate("/user/login");
  }
  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data, setTransactions, transactions, isAuthenticated, navigate]);

  if (loading) {
    return <TransactionHistorySkeleton></TransactionHistorySkeleton>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data) {
    return (
      <Layout>
        <Card className="bg-white shadow-lg w-screen pt-20">
          <CardHeader>
            <CardTitle className="text-primary font-semibold text-xl">
              Payout Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-primary">Course</TableHead>
                  <TableHead className="">Amount</TableHead>
                  <TableHead className="">Address</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-left">
                    Transaction Signature
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: UserTransactions) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-nowrap" >{transaction.course.title}</TableCell>
                    <TableCell>{transaction.amount} SOL</TableCell>
                    <TableCell className="break-words">{transaction.address}</TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="break-words">{transaction.signature}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Layout>
    );
  }
};

export default Transactions;
