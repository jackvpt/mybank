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

    /** @type {string | null} */
    this.status = data.status ?? null

    /** @type {string} */
    this.type = data.type

    /** @type {string} */
    this.details = data.details
  }
}

/** Data retrieved from bank PDF report */
// {
//   "banque": "string",
//   "releve": {
//     "numero": "string",              // "010"
//     "date_arrete": "date",
//     "devise": "string",              // "EUR"
//     "periode": { "du": "date", "au": "date" }
//   },
//   "agence": {
//     "nom": "string",
//     "adresse": "string",
//     "telephone": "string",
//     "fax": "string"
//   },
//   "conseiller": { "nom": "string", "telephone": "string" },
//   "titulaires": ["string"],
//   "adresse_titulaires": "string",

//   "compte": {
//     "type": "string",                // "Compte Chèque"
//     "numero": "string",
//     "iban": "string",
//     "bic": "string",
//     "ancien_solde":  { "date": "date", "montant": "number" },
//     "nouveau_solde": { "date": "date", "montant": "number" },
//     "total_debits": "number",
//     "total_credits": "number",
//     "operations": [
//       {
//         "date_operation": "date",
//         "date_valeur": "date",
//         "libelle": "string",         // ex. "Prlv Orange SA"
//         "details": "string",         // références SEPA, "" si aucune
//         "montant": "number",         // toujours positif
//         "sens": "debit | credit"
//       }
//     ]
//   },

//   "carte": {
//     "type": "string",                // "Visa Premier Dd Soc Op"
//     "numero_masque": "string",
//     "titulaire": "string",
//     "date_prelevement": "date",
//     "montant_total": "number",
//     "operations": [
//       {
//         "date_operation": "date",
//         "libelle": "string",
//         "montant": "number",
//         "sens": "debit"
//       }
//     ]
//   },

//   "decouvert": {
//     "autorise": "number",
//     "taux_debiteur_autorisation_pct": "number",
//     "taeg_pct": "number",
//     "taux_debiteur_compte_pct": "number",
//     "seuil_usure_pct": "number",
//     "date_reference": "date"
//   }
// }
