import { useNavigate } from "react-router-dom"
import "./BankAccountCard.scss"
import { useDispatch } from "react-redux"
import { setBankAccount, setCheckingDate, setCheckingInitialAmount } from "../../features/parametersSlice"
import { addOneMonth } from "../../utils/formatNumber"

const BankAccountCard = ({ account, lastTransaction }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    dispatch(
      setBankAccount({
        name: account.name,
        id: account.id,
        initialBalance: account.initialBalance,
      })
    )
    dispatch(setCheckingDate(addOneMonth(account.lastCheckDate)))
    dispatch(setCheckingInitialAmount(account.lastCheckBalance))
    navigate(`/transactions`)
  }

  return (
    <article className="container-bankAccountCard" onClick={handleClick}>
      <h2 className="bankAccountName">{account.name}</h2>
      <div className="container-bankAccountCard__amount">
        <p className="balanceDate">Solde au {lastTransaction?.shortDate} : </p>
        <p className="currentBalance">
          {account.currentBalance.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </p>
      </div>
      <div className="container-bankAccountCard__details">
        <p className="details-label">Dernière opération : </p>
        <p className="details-name">{lastTransaction?.label}</p>
        <p className="details-amount">{lastTransaction?.amountSummary}</p>
      </div>
    </article>
  )
}

export default BankAccountCard
