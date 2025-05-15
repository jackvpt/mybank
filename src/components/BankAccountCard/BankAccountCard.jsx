import "./BankAccountCard.scss"

const BankAccountCard = ({ account }) => {
    return(
        <article className="container-bankAccountCard">
            <h2 className="bankAccountName">
                {account.name}
            </h2>
            <p className="currentBalance">{account.currentBalance} €</p>
        </article>
    )
}

export default BankAccountCard