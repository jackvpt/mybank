/**
 * Represents a banking recurring transaction.
 */
export default class RecurringTransactionModel {
  /**
   * Creates an instance of RecurringTransactionModel.
   *
   * @param {Object} data - The transaction data.
   * @param {string} data.account - The account involved in the transaction.
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number} [data.debit=0] - The debit amount (money going out).
   * @param {number} [data.credit=0] - The credit amount (money coming in).
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   * @param {string} [data.periodicity=""] - Periodicity of the transaction (e.g. "monthly", "weekly").
   */
  constructor(data) {
    /** @type {string} */
    this.id = data._id

    /** @type {string} */
    this.accountID = data.accountID

    /** @type {string} */
    this.accountName = data.accountName

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
    this.category = data.category

    /** @type {string | undefined} */
    this.subCategory = data.subCategory

    /** @type {number} */
    this.debit = data.debit ?? 0

    /** @type {number} */
    this.credit = data.credit ?? 0

    /** @type {number} */
    this.amount = data.debit > 0 ? data.debit : this.credit

    /** @type {string} */
    this.amountSummary =
      this.debit > 0
        ? `-${this.debit.toFixed(2)}€`
        : this.credit > 0
        ? `+${this.credit.toFixed(2)}€`
        : "0.00€"

    /** @type {string } */
    this.destination = data.destination

    /** @type {string} */
    this.periodicity = data.periodicity || "oneTime"

    /** @type {string} */
    this.notes = data.notes || ""
  }
}
