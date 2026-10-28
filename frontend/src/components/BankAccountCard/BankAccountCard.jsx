// 🎨 Styles
import "./BankAccountCard.scss"

// ⚛️ React
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

// 🏪 Redux
import { setBankAccount } from "../../store/features/parametersSlice"
import AmountGraph from "./AmountGraph"

const BankAccountCard = ({ account }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    dispatch(setBankAccount({ name: account.name, id: account._id }))
    navigate(`/transactions`)
  }

  return (
    <article className="container__bankAccountCard" onClick={handleClick}>
      <h2>{account.name}</h2>
      <div className="container__bankAccountCard-amount">
        <p className="balanceDate">Solde : </p>
        <p className="currentBalance">
          {account.currentBalance.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </p>
      </div>
      <div className="container__bankAccountCard-amountGraph">
        <AmountGraph account={account} />
      </div>
    </article>
  )
}

export default BankAccountCard
