import "./Dashboard.scss"
import { useQuery } from "@tanstack/react-query"
import { fetchBankAccounts } from "../../api/bankAccounts"
import BankAccountCard from "../../components/BankAccountCard/BankAccountCard"

const Dashboard = () => {
  const {
    data: bankAccounts,
    isLoading: isLoadingAccounts,
    error: accountError,
  } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  console.log("bankAccounts :>> ", bankAccounts)

  if (isLoadingAccounts) return <p>Chargement des comptes...</p>
  if (accountError) return <p>Erreur comptes : {accountError.message}</p>

  return (
    <section className="container-dashboard">
      {bankAccounts.map((account) => (
        <BankAccountCard account={account} />
      ))}
    </section>
  )
}

export default Dashboard
