import { useNavigate } from "react-router-dom"
import "./BankAccountCard.scss"
import { useDispatch } from "react-redux"
import { setBankAccount } from "../../features/settingsSlice"

const BankAccountCard = ({ account, lastTransaction }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    dispatch(setBankAccount(account.name))
    navigate(`/transactions`)
  }
  return (
    <article className="container-bankAccountCard" onClick={handleClick}>
      <div className="container-bankAccountCard__summary">
        <h2 className="bankAccountName">{account.name}</h2>
        <p className="currentBalance">
          {account.currentBalance.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </p>
      </div>
      <div className="container-bankAccountCard__details">
        <p className="details-label">Dernière opération: </p>
        <p className="details-name">{lastTransaction?.label}</p>
        <p className="details-amount">{lastTransaction?.amountSummary}</p>
      </div>
    </article>
  )
}

export default BankAccountCard
