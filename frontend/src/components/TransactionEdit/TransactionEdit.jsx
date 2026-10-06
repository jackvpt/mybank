// 🎨 Styles
import "./TransactionEdit.scss"

// ⚛️ React
import { useCallback, useEffect, useMemo, useState } from "react"

// 🏪 Redux
import { useDispatch, useSelector } from "react-redux"
import { clearSelectedTransactionIds } from "../../store/features/parametersSlice"

// 📅 Date picker
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { isValid } from "date-fns"
import { fr } from "date-fns/locale"

// 🧱 MUI components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"

// 🪝 Hooks
import {
  useGetAllTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransactions,
} from "../../hooks/useTransactions"
import { useGetAllCategories } from "../../hooks/useCategories"
import { useGetAllSettings } from "../../hooks/useSettings"
import { useGetAllBankAccounts } from "../../hooks/useBankAccounts"

// 📦 Data for the shortcut buttons
import { shortcuts } from "../../data/transactionEditShortCuts"

// Components
import CustomDatePicker from "../SubComponents/CustomDatePicker/CustomDatePicker"
import CustomSelect from "../SubComponents/CustomSelect/CustomSelect"
import CustomButton from "../SubComponents/CustomButton/CustomButton"

// 📦 Models
import TransactionModel from "../../models/TransactionModel"
import CustomTextField from "../SubComponents/CustomTextField/CustomTextField"

// 📐 Shared field style
const SELECT_SX = { width: "auto", minWidth: 240 }

/**
 * Transaction form: create, modify or delete transactions of the selected account.
 * Edits the transaction when exactly one row is selected in the table.
 *
 * @component
 * @returns {JSX.Element} Rendered TransactionEdit component
 */
const TransactionEdit = () => {
  const dispatch = useDispatch()

  // 🗑️ Delete confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [transactionsToDelete, setTransactionsToDelete] = useState([])

  // 🏪 Redux state
  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name,
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds,
  )

  // 🔄 Mutations (toasts and "transactions" query invalidation are handled
  // inside useTransactions via useMutationWithNotification)
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction()
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction()
  const { mutate: deleteTransactions, isPending: isDeleting } =
    useDeleteTransactions()

  // 🌐 Data
  const { data: settings } = useGetAllSettings()
  const transactionTypes = settings?.types ?? []
  const { data: transactionsCategories = [] } = useGetAllCategories()
  const { data: bankAccounts = [] } = useGetAllBankAccounts()
  const { data: transactions = [] } = useGetAllTransactions()

  // 📝 Form state
  // Rebuilt when the selected account changes, so a new transaction
  // is never created on the previously selected account.
  const getInitialFormData = useCallback(
    () => ({
      date: new Date(),
      accountId: bankAccountId,
      accountName: bankAccountName,
      type: "card",
      checkNumber: "",
      label: "",
      category: null,
      subCategory: "",
      amount: 0,
      status: null,
      destination: "",
      notes: "",
    }),
    [bankAccountId, bankAccountName],
  )

  const [formData, setFormData] = useState(getInitialFormData)

  // 🔁 Sync the form with the selection:
  // one selected row -> load it, otherwise (or after a data refresh) -> empty form.
  // This is also what resets the form after a transaction is added.
  useEffect(() => {
    const selected =
      selectedTransactionIds.length === 1
        ? transactions.find(
            (transaction) => transaction.id === selectedTransactionIds[0],
          )
        : null

    setFormData(
      selected
        ? {
            ...selected,
            date: new Date(selected.date),
            category: selected.category ?? "",
            subCategory: selected.subCategory ?? "",
            type: selected.type ?? "card",
          }
        : getInitialFormData(),
    )
  }, [selectedTransactionIds, transactions, getInitialFormData])

  const debitOrCredit = transactionTypes.find(
    (type) => type.name === formData.type,
  )?.category

  // Categories of the selected type
  const categoriesByType = useMemo(
    () =>
      (transactionsCategories ?? []).filter(
        (category) => category.type === debitOrCredit,
      ),
    [transactionsCategories, formData.type],
  )

  // Sub-categories of the selected category
  const subCategories = useMemo(
    () =>
      transactionsCategories.find(
        (category) => category.name === formData.category,
      )?.subcategories ?? [],
    [transactionsCategories, formData.category],
  )

  // Transfer destinations: every account except the current one
  const destinationAccounts = useMemo(
    () => bankAccounts.filter((account) => account.name !== bankAccountName),
    [bankAccounts, bankAccountName],
  )

  // ✅ Validation (computed once per render, used by the buttons and handlers)
  const isTransfer = formData.type === "transfer"

  /**
   * Calculate the absolute amount, based on the type of transaction (debit or credit).
   * This is used to ensure that the amount is always stored as a negative number for debits,
   * and a positive number for credits, regardless of what the user entered in the form.
   * @returns {number} The absolute amount, negative for debits, positive for credits.
   */
  const absoluteAmount = () => {
    const categoryType = transactionTypes.find(
      (type) => type.name === formData.type,
    )?.category

    return categoryType === "debit"
      ? -Math.abs(formData.amount)
      : Math.abs(formData.amount)
  }

  const formHasErrors =
    !isValid(formData.date) ||
    !Number.isFinite(absoluteAmount()) ||
    absoluteAmount() === 0 ||
    (isTransfer && formData.destination === "") ||
    (formData.type === "check" && formData.checkNumber === "") ||
    (!isTransfer && formData.label.trim() === "")

  // ✍️ Form helpers
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChange = (name) => (e) => {
    let value = e.target.value

    if (name === "amount")
      value = e.target.value.replace(",", ".").replace(/[^0-9.]/g, "")

    setField(name, value)
  }

  /**
   * Format the amount field to two decimal places on blur, and ensure it is a valid number.
   * If the user entered a negative number, it will be preserved.
   * If the user entered an invalid number, the field will be cleared.
   * This ensures that the amount is always stored in a consistent format.
   * The absolute value is calculated later when building the payload for the API.
   */
  const handleAmountBlur = () => {
    const raw = String(formData.amount ?? "")
    const negative = raw.startsWith("-")
    const n = parseFloat(raw.replace("-", "").replace(",", "."))
    setField(
      "amount",
      Number.isNaN(n) || n === 0 ? "" : `${negative ? "-" : ""}${n.toFixed(2)}`,
    )
  }

  /**
   * Build the payload sent to the API from the form data.
   * `amount`, `debit` and `credit` are derived here from the type,
   * so they can never be out of sync with the form.
   *
   * @param {object} [overrides] - Fields to override
   * @returns {object}
   */
  const buildPayload = (overrides = {}) => {
    const newTransaction = new TransactionModel({
      ...formData,
      ...overrides,
    })

    if (!newTransaction.isValid)
      console.error("Transaction is not valid", newTransaction.getErrors())

    return newTransaction.toPayload()
  }

  // ⚡ Fill the form from a shortcut button
  const handleShortcutClick = (shortcut) => {
    let shortcutAmount = shortcut.amount

    // "last": reuse the amount of the latest transaction with the same label
    // on the current account
    if (shortcutAmount === "last") {
      const lastTransaction = transactions
        .filter(
          (transaction) =>
            transaction.accountId === bankAccountId &&
            transaction.label === shortcut.label,
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      shortcutAmount = lastTransaction ? lastTransaction.amount : 0
    }

    const amountNumber = Number(shortcutAmount ?? 0)
    shortcutAmount =
      Number.isNaN(amountNumber) || amountNumber === 0
        ? ""
        : amountNumber.toFixed(2)
        
    setFormData((prev) => ({
      ...prev,
      type: shortcut.type,
      label: shortcut.label,
      amount: shortcutAmount,
      category: shortcut.category,
      subCategory: shortcut.subCategory,
    }))
  }

  // ➕ Create the transaction (a transfer creates a debit and a credit)
  const handleAddTransaction = () => {
    if (formHasErrors) return

    if (isTransfer) {
      const destination = destinationAccounts.find(
        (account) => account.name === formData.destination,
      )
      if (!destination) return

      // Debit on the current account
      createTransaction(
        buildPayload({
          accountId: bankAccountId,
          accountName: bankAccountName,
          label: `Virement vers ${destination.name}`,
          amount: absoluteAmount(),
        }),
      )

      // Credit on the destination account
      createTransaction(
        buildPayload({
          accountId: destination._id,
          accountName: destination.name,
          label: `Virement depuis ${bankAccountName}`,
          amount: absoluteAmount(),
          destination: "",
        }),
      )
      return
    }

    createTransaction(
      buildPayload({
        accountId: bankAccountId,
        accountName: bankAccountName,
        amount: absoluteAmount(),
      }),
    )
  }

  // ✏️ Update the selected transaction (button enabled only with exactly one selected)
  const handleUpdateTransaction = () => {
    if (formHasErrors) return

    updateTransaction({
      id: selectedTransactionIds[0],
      updatedData: buildPayload({ amount: absoluteAmount() }),
    })
  }

  // 🗑️ Delete flow: open the dialog, then confirm
  const handleOpenConfirm = (ids) => {
    setTransactionsToDelete(ids)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (transactionsToDelete.length === 0) return

    deleteTransactions(transactionsToDelete, {
      // The deleted ids would otherwise stay selected in the store
      onSuccess: () => dispatch(clearSelectedTransactionIds()),
    })
    setConfirmOpen(false)
    setTransactionsToDelete([])
  }

  return (
    <section className="container-transaction-edit">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        {/* ⚡ SHORTCUTS */}
        <div className="container-transaction-edit-shortcuts">
          {shortcuts.map((shortcut) => (
            <button
              className="shortcut-button"
              key={shortcut.text}
              type="button"
              onClick={() => handleShortcutClick(shortcut)}
            >
              {shortcut.text}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* 📅 DATE PICKER */}
          <CustomDatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) => setField("date", newValue)}
            format="dd/MM/yyyy"
          />

          {/* 🏷️ TYPE SELECT */}
          <FormControl
            fullWidth
            variant="outlined"
            required
            size="small"
            sx={SELECT_SX}
          >
            <CustomSelect
              label="Type"
              value={formData.type}
              onChange={(value) => setField("type", value)}
              options={transactionTypes.map(({ name, text }) => ({
                value: name,
                label: text,
              }))}
            />
          </FormControl>

          {/* 🧾 CHECK NUMBER */}
          {formData.type === "check" && (
            <TextField
              type="text"
              label="N° chèque"
              value={formData.checkNumber}
              onChange={handleChange("checkNumber")}
              size="small"
              sx={{ width: 120 }}
            />
          )}

          {/* 🏦 DESTINATION SELECT */}
          {isTransfer && (
            <FormControl
              fullWidth
              variant="outlined"
              required
              size="small"
              sx={SELECT_SX}
            >
              <InputLabel id="destination-label">Destination</InputLabel>
              <Select
                labelId="destination-label"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange("destination")}
                label="Destination"
              >
                {destinationAccounts.map((account) => (
                  <MenuItem key={account._id} value={account.name}>
                    {account.name} - {account.bankAbbreviation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 🔤 LABEL (generated automatically for transfers) */}
          {!isTransfer && (
            <CustomTextField
              id="label"
              label="Libellé"
              value={formData.label}
              onChange={handleChange("label")}
              type="text"
              clearField={true}
              copy={false}
              floating={true}
            />
          )}

          {/* 💶 AMOUNT */}
          <CustomTextField
            id="amount"
            label="Montant"
            value={
              formData.amount === 0
                ? ""
                : String(formData.amount ?? "").replace("-", "")
            }
            onChange={handleChange("amount")}
            onBlur={handleAmountBlur}
            type="text"
            clearField={true}
            copy={false}
            floating={true}
          />

          {/* 🗂️ CATEGORY SELECT */}
          {!isTransfer && (
            <CustomSelect
              label="Catégorie"
              value={formData.category ?? ""}
              onChange={(value) => {
                setField("category", value)
                // Changing the category invalidates the sub-category
                setField("subCategory", "")
              }}
              options={categoriesByType.map((category) => ({
                value: category.name,
                label: category.name,
              }))}
            />
          )}

          {/* 🗃️ SUB-CATEGORY SELECT */}
          {!isTransfer && (
            <FormControl fullWidth size="small" sx={SELECT_SX}>
              <CustomSelect
                label="Sous catégorie"
                value={formData.subCategory ?? ""}
                onChange={(value) => setField("subCategory", value)}
                disabled={!formData.category}
                options={subCategories.map((subcategory) => ({
                  value: subcategory,
                  label: subcategory,
                }))}
              />
            </FormControl>
          )}

          {/* 📝 NOTES */}
          <CustomTextField
            id="notes"
            label="Notes"
            value={formData.notes}
            onChange={handleChange("notes")}
            type="text"
            clearField={true}
            copy={false}
            floating={true}
          />

          {/* 🗑️ DELETE BUTTON */}
          <CustomButton
            action="delete"
            loading={isDeleting}
            disabled={selectedTransactionIds.length === 0}
            onClick={() => handleOpenConfirm(selectedTransactionIds)}
          />

          {/* ✏️ MODIFY BUTTON */}
          <CustomButton
            action="update"
            loading={isUpdating}
            disabled={formHasErrors || selectedTransactionIds.length !== 1}
            onClick={handleUpdateTransaction}
          />

          {/* ➕ ADD BUTTON */}
          <CustomButton
            action="create"
            loading={isCreating}
            disabled={formHasErrors}
            onClick={handleAddTransaction}
          />

          {/* 🔄 RESET BUTTON */}
          <CustomButton
            action="reset"
            onClick={() => {
              setFormData(getInitialFormData())
              dispatch(clearSelectedTransactionIds())
            }}
          />
        </form>
      </LocalizationProvider>

      {/* ⚠️ Delete confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {transactionsToDelete.length === 1
              ? "Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
              : `Êtes-vous sûr de vouloir supprimer ces ${transactionsToDelete.length} transactions ? Cette action est irréversible.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export default TransactionEdit
