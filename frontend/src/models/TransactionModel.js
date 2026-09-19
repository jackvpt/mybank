/**
 * Represents a banking transaction.
 */
export default class TransactionModel {
  /**
   * Creates an instance of TransactionModel.
   *
   * @param {Object} data - The transaction data.
   * @param {string} data.accountId - The account id involved in the transaction.
   * @param {string} data.accountName - The account name involved in the transaction.
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} [data.checkNumber] - The check serial number (if applicable).
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number} data.amount - The transaction amount (negative = debit, positive = credit).
   * @param {string} [data.status] - Status of the transaction (null, "pointed", "validated").
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   * @param {string} [data.notes] - Free-text notes attached to the transaction.
   */
  constructor(data) {
    /** @type {string} */
    this.id = data._id

    /** @type {string} */
    this.accountId = data.accountId

    /** @type {string} */
    this.accountName = data.accountName

    /** @type {Date} */
    this.date = new Date(data.date)

    /** @type {string} */
    this.shortDate = this.date.toLocaleDateString("fr-FR")

    /** @type {string} */
    this.type = data.type

    /** @type {string | undefined} */
    this.checkNumber = data.checkNumber

    /** @type {string} */
    this.label = data.label

    /** @type {string} */
    this.category = convertCategory(data.category)

    /** @type {string | undefined} */
    this.subCategory = data.subCategory

    /** @type {number} */
    this.amount = data.amount

    /** @type {number} */
    this.debit = this.amount < 0 ? Math.abs(this.amount) : 0

    /** @type {number} */
    this.credit = this.amount > 0 ? this.amount : 0

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

/**
 * Maps a raw category label to its display name.
 * Falls back to the original value when no mapping is defined.
 *
 * @param {string} category - The raw category label.
 * @returns {string} The display category.
 */
const convertCategory = (category) => {
  if (category === "Traitements et salaires") {
    return "Revenus"
  }
  return category
}