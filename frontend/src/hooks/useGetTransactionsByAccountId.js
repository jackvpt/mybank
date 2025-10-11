import { useSelector } from "react-redux"
import { useFetchTransactions } from "./useFetchTransactions"

export const useGetTransactionsByAccountId = () => {
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  {
    const { data: transactions, ...rest } = useFetchTransactions()

    const filtered = transactions?.filter(
      (transaction) => transaction.accountId === bankAccountId
    )

    return { data: filtered, ...rest }
  }
}
