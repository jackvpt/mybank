// import { faker } from "@faker-js/faker"
import fs from "fs/promises"
import { writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const filePath = path.join(__dirname, "comptes2017.qif")

function parseDate(qifDate) {
  // Exemple : "D09/08'2019" → "2019-08-09"
  const match = qifDate.match(/^D(\d{2})\/(\d{2})'(\d{4})$/)
  if (match) {
    const [_, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  return null
}

function parseAmount(amountStr) {
  // Retire les virgules et convertit en float
  return parseFloat(amountStr.replace(/,/g, ""))
}

function parseQIF(content, bankAccountName) {
  const entries = content
    .split("^")
    .map((entry) => entry.trim())
    .filter(Boolean)
  const result = []

  for (const entry of entries) {
    const lines = entry.split("\n").map((line) => line.trim())
    const transaction = {}

    transaction.account = bankAccountName

    let type = "card"

    for (const line of lines) {
      if (line.startsWith("D")) transaction.date = parseDate(line)
      if (line.startsWith("T")) {
        const amount = parseAmount(line.slice(1))
        if (amount < 0) {
          transaction.debit = Math.abs(amount)
        } else {
          transaction.credit = amount
        }
      }
      if (line.startsWith("P")) {
        const label = line.slice(1).trim()
        transaction.label = label
        if (label === "Virement") {
          type = "transfer"
        }
      }
      if (line.startsWith("N")) {
        type = "check"
        transaction.checkNumber = line.slice(1).trim()
      }
      if (line.startsWith("C")) {
        if (line.slice(1).trim() === "X") {
          transaction.status = "validated"
        }
      }
      if (line.startsWith("L")) {
        const category = line.slice(1).trim()
        if (category[0] === "[" && category[category.length - 1] === "]") {
          type = "transfer"
          transaction.label =
            "Virement vers " + category.replace(/^\[|\]$/g, "")
          transaction.destination = category.replace(/^\[|\]$/g, "")
        } else if (type === "transfer") {
          transaction.label =
            "Virement vers " + category.replace(/^\[|\]$/g, "")
          transaction.destination = category.replace(/^\[|\]$/g, "")
          transaction.category = "Virement"
        } else {
          transaction.category = category.split(":")[0].trim()
          transaction.subcategory = category.split(":")[1]?.trim() || ""
          transaction.category = category.split(":")[0].trim()
          transaction.subcategory = category.split(":")[1]?.trim() || ""
        }
      }
      transaction.type = type
    }

    if (Object.keys(transaction).length > 0) {
      if (new Date(transaction.date) > new Date(2025, 1, 1)) result.push(transaction)
    }
  }

  return result
}

async function convertQIFtoJSON(bankAccountName, fileName) {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, fileName)
    const rawData = await fs.readFile(filePath, "utf-8")
    const transactions = parseQIF(rawData, bankAccountName)
    const jsonString = JSON.stringify(transactions, null, 2)

    console.log(jsonString)

    try {
      writeFileSync("transactions.json", jsonString, "utf8")
      console.log("Fichier JSON écrit avec succès")
    } catch (err) {
      console.error("Erreur d'écriture :", err)
    }

    return transactions
  } catch (err) {
    console.error("Erreur de conversion du fichier QIF :", err)
  }
}

convertQIFtoJSON("Courant", "courant.qif")
