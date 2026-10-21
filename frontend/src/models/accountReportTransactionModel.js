/**
 * Represents a transaction from account report.
 * @typedef {Object} ParsedTransaction
 * @property {string} date - Transaction date (ISO date).
 * @property {string} label - Transaction label.
 * @property {number} amount - Transaction amount.
 */
export default class AccountReportTransactionModel {
  /**
   * Creates an instance of AccountReportTransactionModel.
   *
   * @param {ParsedTransaction} data - The transaction data.
   */
  constructor(data) {
    /** @type {Date} */
    this.date = new Date(data.date_operation)

    /** @type {string} */
    this.formattedDate = this.date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    /** @type {string} */
    this.label = data.libelle

    /** @type {string} */
    this.sens = data.sens

    /** @type {number} */
    this.amount = data.montant
    if (this.sens !== "credit") {
      this.amount = -this.amount
    }

    /** @type {string} */
    this.type = data.type

    /** @type {string} */
    this.detail = data.detail
  }
}
