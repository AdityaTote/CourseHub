import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";
import { useRecoilState } from "recoil";
import { adminTransactionAtom } from "@/store/atom";
import { useEffect } from "react";
import { TransactionHistorySkeleton } from "./TransactionHistorySkeleton";
import { AdminTransactions } from "@/types";



const TransactionHistory: React.FC = () => {
  const { data, error, loading } = useFetch(`${BACKEND_URL}/api/v1/admin/transactions`, true);
  const [transactions, setTransactions] = useRecoilState(adminTransactionAtom);

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
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary">Payout Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Transaction Signature</TableHead>
                <TableHead className="text-primary">Date</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: AdminTransactions) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.tansactionId}</TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.amount} SOL</TableCell>
                  <TableCell>Success</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
}

export default TransactionHistory;

