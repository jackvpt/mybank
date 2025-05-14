import "./Transactions.scss"
import { fetchBankAccountByName } from "../../api/bankAccount"
import { useQuery } from "@tanstack/react-query"

const Transactions = () => {
  const bankAccountName = "Courant"
  /**
   * Query to fetch the bank account data using their name.
   */
  const {
    data: bankAccount,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts", bankAccountName],
    queryFn: () => fetchBankAccountByName(bankAccountName)
  })

  if (isLoading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <section className="container-transactions">
      <h1>Transactions</h1>
      <p>Here you can view your transactions.</p>
      <p>
        Account: {bankAccount.name} – Balance: {bankAccount.currentBalance} €
      </p>
    </section>
  )
}

export default Transactions
