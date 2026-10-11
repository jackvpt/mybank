/** Transaction types that require an extra field. Adapt to the values stored in DB. */
const TYPE_CHECK = "check"
const TYPE_TRANSFER = "transfer"

/**
 * Represents a banking recurring transaction.
 */
export default class RecurringTransactionModel {
  /**
   * Creates an instance of RecurringTransactionModel.
   *
   * @param {Object} data - The transaction data.
   * @param {string} data.accountId - The ID of the account involved in the transaction.
   * @param {string} data.accountName - The name of the account involved in the transaction.
   * @param {string|Date} data.date - The date of the transaction (ISO string or Date object).
   * @param {string} data.type - The type of transaction (e.g. "card", "check", "transfer", "auto debit").
   * @param {string} data.label - The transaction label or description.
   * @param {string} data.category - The main category of the transaction.
   * @param {string} [data.subCategory] - A more specific sub-category (optional).
   * @param {number} data.amount - The transaction amount (negative = debit, positive = credit).
   * @param {string} [data.destination] - Destination of the transfer, if applicable.
   * @param {string} [data.periodicity] - Periodicity of the transaction (e.g. "monthly", "weekly").
   */
  constructor(data = {}) {
    /** @type {string} */
    this.id = data._id

    /** @type {string} */
    this.accountId = data.accountId

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
    this.amount = Number(data.amount)

    /** @type {number} */
    this.amount = Number(data.amount)

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

  /** @returns {number} Display only (debit column): absolute amount when negative, else 0. */
  get debit() {
    return this.amount < 0 ? Math.abs(this.amount) : 0
  }

  /** @returns {number} Display only (credit column): amount when positive, else 0. */
  get credit() {
    return this.amount > 0 ? this.amount : 0
  }

  /** @returns {boolean} True if the date is a real date. */
  get hasValidDate() {
    return !Number.isNaN(this.date.getTime())
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
    if (!Number.isFinite(this.amount) || this.amount === 0)
      errors.push("amount")
    if (this.type === TYPE_CHECK && !this.checkNumber)
      errors.push("checkNumber")
    if (this.type === TYPE_TRANSFER && !this.destination)
      errors.push("destination")
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
      destination: this.type === TYPE_TRANSFER ? this.destination : undefined,
      periodicity: this.periodicity || undefined,
      notes: this.notes,
    }
  }
}
