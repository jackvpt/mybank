/**
 * Represents a periodicity.
 */
export default class PeriodicityModel {
  /**
   * Creates an instance of PeriodicityModel.
   *
   * @param {string} data.name - Periodicity name (e.g. "monthly", "quarterly", "semiAnnually", "annually").
   * @param {string} data.text - Periodicity text (e.g. "Mensuel", "Trimestriel", "Semestriel", "Annuel").
   */
  constructor(data) {
    /** @type {string} */
    this.name = data.name

    /** @type {string} */
    this.text = data.text
  }
}
