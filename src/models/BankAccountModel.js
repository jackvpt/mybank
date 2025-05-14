/**
 * Represents a bank account.
 */
export default class BankAccountModel {
  /**
   * Creates an instance of BankAccountModel.
   *
   * @param {Object} data - The account data.
   * @param {string} data.id - Unique identifier of the bank account.
   * @param {string} data.name - Account name (e.g. "Courant").
   * @param {string} data.bankName - Full name of the bank.
   * @param {string} data.bankAbbreviation - Abbreviated bank name (e.g. "CA").
   * @param {string} data.IBAN - International Bank Account Number.
   * @param {string} data.BIC - Bank Identifier Code.
   * @param {number} data.initialBalance - Initial balance when the account was created.
   * @param {string|Date} data.createdAt - ISO date string or Date object of account creation.
   * @param {number} data.currentBalance - Current balance of the account.
   * @param {string|Date} data.updatedAt - ISO date string or Date object of last update.
   */
  constructor(data) {
    /** @type {string} */
    this.id = data.id

    /** @type {string} */
    this.name = data.name

    /** @type {string} */
    this.bankName = data.bankName

    /** @type {string} */
    this.bankAbbreviation = data.bankAbbreviation

    /** @type {string} */
    this.IBAN = data.IBAN

    /** @type {string} */
    this.BIC = data.BIC

    /** @type {number} */
    this.initialBalance = data.initialBalance

    /** @type {Date} */
    this.createdAt = new Date(data.createdAt)

    /** @type {number} */
    this.currentBalance = data.currentBalance

    /** @type {Date} */
    this.updatedAt = new Date(data.updatedAt)
  }
}
