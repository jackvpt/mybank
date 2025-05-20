import { faker } from "@faker-js/faker"
import { writeFile } from "fs/promises"

// Liste de quelques départements
const accountName = ["Courant", "BForBank", "Livret A"]
const types = ["card", "check", "transfer", "auto debit"]
const periodicity = ["", "monthly", "weekly", "yearly"]

const data = []
const totalEntries = 1000 // Nombre d'entrées à générer

for (let i = 0; i < totalEntries; i++) {
  const type = faker.helpers.arrayElement(types)
  const isDebit = faker.datatype.boolean()
  

  const record = {
    id: faker.string.uuid(),
    date: faker.date.recent(30).toISOString(), // Date in the last 30 days
    account: faker.helpers.arrayElement(accountName),
    type: type, // e.g. "card", "check", "transfer", "auto debit"
    checkNumber: type === "check" ? faker.finance.routingNumber() : null,
    label: faker.commerce.productName(), // e.g. "Bluetooth Headphones"
    category: faker.helpers.arrayElement([
      "Food",
      "Utilities",
      "Entertainment",
      "Transport",
    ]),
    subCategory: faker.helpers.arrayElement([
      "Groceries",
      "Electricity",
      "Cinema",
      "Bus",
    ]),
    debit: isDebit ? Number(faker.finance.amount(5, 500, 2)) : 0,
    credit: isDebit ? 0 : Number(faker.finance.amount(5, 500, 2)),
    pointed: faker.datatype.boolean(),
    validated: faker.datatype.boolean(),
    destination: type==="transfer" ? faker.helpers.arrayElement(accountName) : "", // destination email (e.g. for transfers)
    periodicity: faker.helpers.arrayElement(periodicity),
  }

  data.push(record) // Ajoute l'enregistrement dans le tableau de données
}

// Génération du fichier JSON
await writeFile("mock_data.json", JSON.stringify(data, null, 4), "utf8")

console.log(
  `Le fichier 'mock_data.json' a été généré avec ${totalEntries} entrées.`
)
