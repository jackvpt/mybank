/**
 * Represents a banking transaction.
 */
export default class TransactionModel {
  /**
   * Creates an instance of TransactionModel.
   *
   * @param {Object} data - The transaction data.
<<<<<<< HEAD
   * @param {string} data.id - Unique identifier for the transaction.
   * @param {string} data.accountId - The ID of the account involved in the transaction.
   * @param {string} [data.accountName] - The name of the account (if available).
=======
   * @param {string} data.accountId - The account id involved in the transaction.
   * @param {string} data.accountName - The account name involved in the transaction.
>>>>>>> 049dccb32c4e55e6b3f02ed41f016af6c8d9d908
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} [data.checkNumber] - The check serial number (if applicable).
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number} [data.debit=0] - The debit amount (money going out).
   * @param {number} [data.credit=0] - The credit amount (money coming in).
   * @param {string} [data.status] - Status of the transaction (null, "pointed","validated").
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   */
  constructor(data) {
    /** @type {string} */
    this.id = data._id 

    /** @type {string} */
    this.accountId = data.accountId

    /** @type {string} */
    this.accountName = data.accountName === "" || data.accountName === null ? data.account : data.accountName

    /** @type {Date} */
    this.date = new Date(data.date)

    /** @type {string} */
    this.shortDate = this.date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    /** @type {string} */
    this.type = data.type

    /** @type {string | undefined} */
    this.checkNumber = data.checkNumber

    /** @type {string} */
    this.label = data.label

    /** @type {string} */
    this.category =convertCategory(data.category)

    /** @type {string | undefined} */
    this.subCategory = data.subCategory

    /** @type {number} */
    this.debit = data.debit ?? 0

    /** @type {number} */
    this.credit = data.credit ?? 0

    /** @type {number} */
    this.amount = this.debit > 0 ? this.debit : this.credit

    /** @type {string} */
    this.amountSummary =
      this.debit > 0
        ? `-${this.debit.toFixed(2)}€`
        : this.credit > 0
        ? `+${this.credit.toFixed(2)}€`
        : "0.00€"

    /** @type {string} */
    this.status = data.status ?? null

    /** @type {string | undefined} */
    this.destination = data.destination

    /** @type {string} */
    this.notes = data.notes || ""
  }
}

const convertCategory = (category) => {
  if (category === "Traitements et salaires") {
    return "Revenus"
  }
}
