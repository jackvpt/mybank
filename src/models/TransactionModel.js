/**
 * Represents a banking transaction.
 */
export default class TransactionModel {
  /**
   * Creates an instance of TransactionModel.
   *
   * @param {Object} data - The transaction data.
   * @param {string} data.id - Unique identifier of the transaction.
   * @param {string} data.account - The account involved in the transaction.
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} [data.checkNumber] - The check serial number (if applicable).
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number} [data.debit=0] - The debit amount (money going out).
   * @param {number} [data.credit=0] - The credit amount (money coming in).
   * @param {boolean} [data.pointed=false] - Whether the transaction is pointed (pre-validated).
   * @param {boolean} [data.validated=false] - Whether the transaction is fully validated (by bank).
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   * @param {string} [data.periodicity=""] - Periodicity of the transaction (e.g. "monthly", "weekly").
   */
  constructor(data) {
    /** @type {string} */
    this.id = data.id

    /** @type {string} */
    this.account = data.account

    /** @type {Date} */
    this.date = new Date(data.date)

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

    /** @type {string} */
    this.amountSummary =
      this.debit > 0
        ? `-${this.debit.toFixed(2)}€`
        : this.credit > 0
        ? `+${this.credit.toFixed(2)}€`
        : "0.00€"

    /** @type {boolean} */
    this.pointed = data.pointed ?? false

    /** @type {boolean} */
    this.validated = data.validated ?? false

    /** @type {string | undefined} */
    this.destination = data.destination

    /** @type {string} */
    this.periodicity = data.periodicity || ""
  }
}
