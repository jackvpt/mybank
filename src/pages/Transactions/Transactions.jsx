import "./Transactions.scss"
import { fetchBankAccounts } from "../../api/bankAccount"
import { fetchTransactionsByAccountName } from "../../api/transactions"
import { useQuery } from "@tanstack/react-query"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"

const Transactions = () => {
  const [bankAccountName, setBankAccountName] = useState("Courant")

  const {
    data: bankAccounts,
    isLoading: isLoadingAccounts,
    error: accountError,
  } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", bankAccountName],
    queryFn: () => fetchTransactionsByAccountName(bankAccountName),
    enabled: !!bankAccountName, // ne lance la requête que si un nom est sélectionné
  })

  const handleBankAccountNameChange = (e) => {
    setBankAccountName(e.target.value)
  }

  if (isLoadingAccounts) return <p>Chargement des comptes...</p>
  if (accountError) return <p>Erreur comptes : {accountError.message}</p>

  return (
    <section className="container-transactions">
      <h1>Transactions</h1>
      <FormControl fullWidth variant="outlined" required size="small">
        <InputLabel id="bankAccountName-label">Compte</InputLabel>
        <Select
          labelId="bankAccountName-label"
          id="bankAccountName"
          name="bankAccountName"
          value={bankAccountName}
          onChange={handleBankAccountNameChange}
          label="Compte"
          variant="standard"
        >
          {bankAccounts.map((account) => (
            <MenuItem key={account.id} value={account.name} sx={{ minHeight: "32px", paddingY: "4px" }}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isLoadingTransactions && <p>Chargement des transactions...</p>}
      {transactionsError && <p>Erreur transactions : {transactionsError.message}</p>}

      {transactions && (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id}>
              {tx.date} - {tx.description} - {tx.amount} €
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Transactions
