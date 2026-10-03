/**
 * Represents a type.
 */
export default class TypeModel {
  /**
   * Creates an instance of TypeModel.
   *
   * @param {string} data.name - Type name (e.g. "card", "check", "transfer","autodebit", "directdeposit").
   * @param {string} data.text - Type text (e.g. "Carte bancaire", "Chèque", "Virement", "Prélèvement automatique", "Versement").
   * @param {string} data.category - Type category (e.g. "debit", "credit", "transfer").
   */
  constructor(data) {
    /** @type {string} */
    this.name = data.name

    /** @type {string} */
    this.text = data.text

    /** @type {string} */
    this.category = data.category
  }
}
