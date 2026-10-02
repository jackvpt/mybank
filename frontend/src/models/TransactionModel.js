/** Allowed values for the `status` field (null = not yet processed). */
export const STATUSES = ["pointed", "validated"]

/** Transaction types that require an extra field. Adapt to the values stored in DB. */
const TYPE_CHECK = "check"
const TYPE_TRANSFER = "transfer"

/**
 * Represents a banking transaction.
 */
export default class TransactionModel {
  /**
   * Creates an instance of TransactionModel.
   *
   * @param {Object} data - The transaction data.
   * @param {string} [data._id] - The transaction id (undefined for a new transaction).
   * @param {string} data.accountId - The account id involved in the transaction.
   * @param {string} data.accountName - The account name involved in the transaction.
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} [data.checkNumber] - The check serial number (if applicable).
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number|string} data.amount - The transaction amount (negative = debit, positive = credit).
   * @param {string|null} [data.status] - Status of the transaction (null, "pointed", "validated").
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   * @param {string} [data.notes] - Free-text notes attached to the transaction.
   */
  constructor(data = {}) {
    /** @type {string | undefined} */
    this.id = data._id

    /** @type {string} */
    this.accountId = data.accountId

    /** @type {string} */
    this.accountName = data.accountName

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

    /** @type {number} NaN when missing or not numeric (caught by getErrors). */
    this.amount = Number(data.amount)

    /** @type {string | null} */
    this.status = data.status ?? null

    /** @type {string | undefined} */
    this.destination = data.destination

    /** @type {string} */
    this.notes = data.notes || ""
  }

  /** @returns {boolean} True if the date is a real date. */
  get hasValidDate() {
    return !Number.isNaN(this.date.getTime())
  }

  /** @returns {string} Date formatted for display, empty if invalid. */
  get shortDate() {
    return this.hasValidDate ? this.date.toLocaleDateString("fr-FR") : ""
  }

  /** @returns {string} Signed amount for display, e.g. "-12.50€". */
  get amountSummary() {
    if (this.debit > 0) return `-${this.debit.toFixed(2)}€`
    if (this.credit > 0) return `+${this.credit.toFixed(2)}€`
    return "0.00€"
  }

  /**
   * Returns the names of the invalid fields (empty array if valid).
   *
   * @returns {string[]}
   */
  getErrors() {
    const errors = []
    if (!this.accountId) errors.push("accountId")
    if (!this.accountName) errors.push("accountName")
    if (!this.hasValidDate) errors.push("date")
    if (!this.type) errors.push("type")
    if (!this.label?.trim()) errors.push("label")
    if (!this.category) errors.push("category")
    if (!Number.isFinite(this.amount) || this.amount === 0) errors.push("amount")
    if (this.type === TYPE_CHECK && !this.checkNumber) errors.push("checkNumber")
    if (this.type === TYPE_TRANSFER && !this.destination) errors.push("destination")
    if (this.status && !STATUSES.includes(this.status)) errors.push("status")
    return errors
  }

  /**
   * @returns {boolean} True if the transaction can be submitted.
   */
  isValid() {
    return this.getErrors().length === 0
  }

  /**
   * Builds the plain object sent to the API (create or update).
   * `id` is excluded (it goes in the URL), derived display fields are excluded,
   * and `debit` / `credit` are included to match the Mongoose schema.
   *
   * @returns {Object}
   */
  toPayload() {
    return {
      accountId: this.accountId,
      accountName: this.accountName,
      date: this.hasValidDate ? this.date.toISOString() : null,
      type: this.type,
      checkNumber: this.type === TYPE_CHECK ? this.checkNumber : undefined,
      label: this.label?.trim(),
      category: this.category,
      subCategory: this.subCategory || undefined,
      amount: this.amount,
      status: this.status,
      destination: this.type === TYPE_TRANSFER ? this.destination : undefined,
      notes: this.notes,
    }
  }
}