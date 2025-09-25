import "./Dashboard.scss"
import { useQuery } from "@tanstack/react-query"
import BankAccountCard from "../../components/BankAccountCard/BankAccountCard"
import { fetchAllTransactions } from "../../api/transactions"
import { useFetchBankAccounts } from "../../hooks/useFetchBankAccounts"

const Dashboard = () => {
  const {
    isLoading: isLoadingBankAccounts,
    error: bankAccountsError,
    data: bankAccounts,
  } = useFetchBankAccounts()

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchAllTransactions,
  })

  if (isLoadingBankAccounts || isLoadingTransactions)
    return <p>Chargement des données...</p>
  if (bankAccountsError)
    return <p>Erreur comptes : {bankAccountsError.message}</p>
  if (transactionsError)
    return <p>Erreur transactions : {transactions.message}</p>

  return (
    <section className="container-dashboard">
      {bankAccounts.map((account) => {
        const accountTransactions =
          transactions?.filter((t) => t.account === account.name) || []
        const lastTransaction =
          accountTransactions
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
        return (
          <BankAccountCard
            key={account.id}
            account={account}
            lastTransaction={lastTransaction}
          />
        )
      })}
    </section>
  )
}

export default Dashboard
