import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";
import { useRecoilState } from "recoil";
import {  userTransactionAtom } from "@/store/atom";
import { useEffect } from "react";
import { TransactionHistorySkeleton } from "@/components/TransactionHistorySkeleton";
import { UserTransactions } from "@/types";
import { Layout } from "@/components/Layout";


const Transactions: React.FC = () => {
  const { data, error, loading } = useFetch(`${BACKEND_URL}/api/v1/user/transactions`, true);
  const [transactions, setTransactions] = useRecoilState(userTransactionAtom);

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data, setTransactions, transactions]);

  if(loading){
    return(
      <TransactionHistorySkeleton></TransactionHistorySkeleton>
    )
  }

  if(data){
    return (
      <Layout>
      <Card className="bg-white shadow-lg w-screen pt-20 ">
        <CardHeader>
          <CardTitle className="text-primary">Payout Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Transaction Signature</TableHead>
                <TableHead className="text-primary">Date</TableHead>
                <TableHead className="text-primary">Address</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Course</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: UserTransactions) => (
                <TableRow key={transaction.id}>
                  <TableCell >{transaction.signature}</TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.address} SOL</TableCell>
                  <TableCell>{transaction.amount} SOL</TableCell>
                  <TableCell>{transaction.course.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </Layout>
    );
  }
}

export default Transactions;

