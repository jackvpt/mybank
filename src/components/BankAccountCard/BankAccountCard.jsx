import "./BankAccountCard.scss"

const BankAccountCard = ({ account, lastTransaction }) => {
  console.log('lastTransaction :>> ', lastTransaction);
    return (
    <article className="container-bankAccountCard">
      <h2 className="bankAccountName">{account.name}</h2>
      <p className="currentBalance">
        {account.currentBalance.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })}
      </p>
      <p>{lastTransaction?.label}</p>
    </article>
  )
}

export default BankAccountCard
