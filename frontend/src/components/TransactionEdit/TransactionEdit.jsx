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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"

// 🎯 Icons (direct imports keep the Vite dev server fast)
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"

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

// 🔒 Stable empty array: a new `[]` on each render would re-trigger effects and memos
const EMPTY_LIST = []

// 🏷️ Transaction types with a specific behavior
const DEFAULT_TYPE = "card"
const CREDIT_TYPE = "deposit" // amount goes to `credit`, any other type goes to `debit`
const TRANSFER_TYPE = "transfer"

// 📐 Shared field style
const SELECT_SX = { width: "auto", minWidth: 240 }

/**
 * Convert a form amount ("12,5", "12.50", 12.5) to a number.
 * Returns NaN when the value is not a valid number.
 *
 * @param {string|number} value
 * @returns {number}
 */
const parseAmount = (value) => Number(String(value ?? "").replace(",", "."))

/**
 * Contained action button with an icon, and a spinner while a mutation is pending.
 * Disabled during the mutation to prevent double submissions.
 *
 * @param {object} props
 * @param {string} props.label - Button text
 * @param {JSX.Element} props.icon - Start icon
 * @param {string} props.color - Background color
 * @param {string} props.hoverColor - Background color on hover
 * @param {boolean} props.isPending - Mutation in progress
 */
const ActionButton = ({
  label,
  icon,
  color,
  hoverColor,
  isPending,
  disabled,
  ...props
}) => (
  <Button
    variant="contained"
    startIcon={isPending ? undefined : icon}
    disabled={disabled || isPending}
    sx={{
      minWidth: 140,
      backgroundColor: color,
      color: "#fff",
      "&:hover": { backgroundColor: hoverColor },
      textTransform: "none",
      fontWeight: 600,
      px: 3,
      py: 1,
      borderRadius: 1,
      boxShadow: 3,
    }}
    {...props}
  >
    {isPending ? <CircularProgress size={24} color="inherit" /> : label}
  </Button>
)

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

  const { mutate: updateTransaction, isPending: isUpdating } = useUpdateTransaction()
  const { mutate: deleteTransactions, isPending: isDeleting } = useDeleteTransactions()

  // 🌐 Data
  const { data: settings } = useGetAllSettings()

  const { data: transactionsCategories = EMPTY_LIST } = useGetAllCategories()

  const { data: bankAccounts = EMPTY_LIST } = useGetAllBankAccounts()

  const { data: transactions = EMPTY_LIST } = useGetAllTransactions()

  // 📝 Form state
  // Rebuilt when the selected account changes, so a new transaction
  // is never created on the previously selected account.
  const getInitialFormData = useCallback(
    () => ({
      date: new Date(),
      accountId: bankAccountId,
      accountName: bankAccountName,
      type: DEFAULT_TYPE,
      checkNumber: "",
      label: "",
      category: null,
      subCategory: "",
      amount: 0,
      debit: 0,
      credit: 0,
      status: null,
      destination: "",
      periodicity: null,
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
        ? transactions.find((tx) => tx.id === selectedTransactionIds[0])
        : null

    setFormData(
      selected
        ? {
            ...selected,
            date: new Date(selected.date),
            category: selected.category ?? "",
            subCategory: selected.subCategory ?? "",
            type: selected.type ?? DEFAULT_TYPE,
          }
        : getInitialFormData(),
    )
  }, [selectedTransactionIds, transactions, getInitialFormData])

  // 🧮 Derived data
  const transactionTypes = settings?.[0]?.types ?? EMPTY_LIST

  // Categories grouped by type ("debit" / "credit")
  const groupedTransactionsCategories = useMemo(
    () =>
      transactionsCategories.reduce((acc, category) => {
        if (!acc[category.type]) acc[category.type] = []
        acc[category.type].push(category)
        return acc
      }, {}),
    [transactionsCategories],
  )

  // Sub-categories of the selected category
  const subCategories = useMemo(
    () =>
      transactionsCategories.find((c) => c.name === formData.category)
        ?.subcategories ?? EMPTY_LIST,
    [transactionsCategories, formData.category],
  )

  // Transfer destinations: every account except the current one
  const destinationAccounts = useMemo(
    () => bankAccounts.filter((account) => account.name !== bankAccountName),
    [bankAccounts, bankAccountName],
  )

  // ✅ Validation (computed once per render, used by the buttons and handlers)
  const amount = parseAmount(formData.amount)
  const isTransfer = formData.type === TRANSFER_TYPE

  const hasErrors =
    !isValid(formData.date) ||
    !Number.isFinite(amount) ||
    amount === 0 ||
    (isTransfer && formData.destination === "") ||
    (formData.type === "check" && formData.checkNumber === "") ||
    (!isTransfer && formData.label.trim() === "")

  // ✍️ Form helpers
  const setField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }))

  const handleChange = (name) => (e) => setField(name, e.target.value)

  /**
   * Build the payload sent to the API from the form data.
   * `amount`, `debit` and `credit` are derived here from the type,
   * so they can never be out of sync with the form.
   *
   * @param {object} [overrides] - Fields to override
   * @returns {object}
   */
  const buildPayload = (overrides = {}) => {
    const isCredit = formData.type === CREDIT_TYPE
    return {
      ...formData,
      amount,
      debit: isCredit ? 0 : amount,
      credit: isCredit ? amount : 0,
      ...overrides,
    }
  }

  // 🔢 Format the amount with two decimals when leaving the field
  const handleAmountBlur = () => {
    if (Number.isFinite(amount)) setField("amount", amount.toFixed(2))
  }

  // ⚡ Fill the form from a shortcut button
  const handleShortcutClick = (shortcut) => {
    let shortcutAmount = shortcut.amount

    // "last": reuse the amount of the latest transaction with the same label
    // on the current account
    if (shortcutAmount === "last") {
      const lastTransaction = transactions
        .filter(
          (t) => t.accountId === bankAccountId && t.label === shortcut.label,
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      shortcutAmount = lastTransaction ? lastTransaction.amount : 0
    }

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
    if (hasErrors) return

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
          debit: amount,
          credit: 0,
        }),
      )

      // Credit on the destination account
      createTransaction(
        buildPayload({
          accountId: destination._id,
          accountName: destination.name,
          label: `Virement depuis ${bankAccountName}`,
          debit: 0,
          credit: amount,
          destination: "",
        }),
      )
      return
    }

    createTransaction(
      buildPayload({ accountId: bankAccountId, accountName: bankAccountName }),
    )
  }

  // ✏️ Modify the selected transaction (button enabled only with exactly one selected)
  const handleModifyTransaction = () => {
    if (hasErrors) return
    updateTransaction({
      id: selectedTransactionIds[0],
      updatedData: buildPayload(),
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
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) => setField("date", newValue)}
            format="dd/MM/yyyy"
            sx={{ width: "auto", minWidth: 150, maxWidth: 180 }}
            slotProps={{ textField: { size: "small" } }}
          />

          {/* 🏷️ TYPE SELECT */}
          <FormControl
            fullWidth
            variant="outlined"
            required
            size="small"
            sx={SELECT_SX}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange("type")}
              label="Type"
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type.name} value={type.name}>
                  {type.text}
                </MenuItem>
              ))}
            </Select>
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
            <TextField
              label="Libellé"
              name="label"
              value={formData.label}
              onChange={handleChange("label")}
              placeholder="Courses"
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={{ width: "auto", minWidth: 350 }}
            />
          )}

          {/* 💶 AMOUNT */}
          <TextField
            type="text"
            label="Montant"
            value={formData.amount}
            onChange={handleChange("amount")}
            onBlur={handleAmountBlur}
            placeholder="0.00"
            size="small"
            sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
          />

          {/* 🗂️ CATEGORY SELECT */}
          {!isTransfer && (
            <FormControl fullWidth size="small" sx={SELECT_SX}>
              <InputLabel id="category-label">Catégorie</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category ?? ""}
                onChange={(e) =>
                  // Changing the category invalidates the sub-category
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    subCategory: "",
                  }))
                }
                label="Catégorie"
              >
                {Object.entries(groupedTransactionsCategories).map(
                  ([type, categories]) => [
                    <ListSubheader
                      key={type}
                      sx={{
                        backgroundColor: "#ddd",
                        color: "#1976d2",
                        fontWeight: 900,
                      }}
                    >
                      {type === "debit" ? "Débit" : "Crédit"}
                    </ListSubheader>,
                    ...categories.map((category) => (
                      <MenuItem
                        key={category.name}
                        value={category.name}
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {category.name}
                      </MenuItem>
                    )),
                  ],
                )}
              </Select>
            </FormControl>
          )}

          {/* 🗃️ SUB-CATEGORY SELECT */}
          {!isTransfer && (
            <FormControl fullWidth size="small" sx={SELECT_SX}>
              <InputLabel id="subCategory-label">Sous catégorie</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory"
                name="subCategory"
                value={formData.subCategory ?? ""}
                onChange={handleChange("subCategory")}
                label="Sous catégorie"
                disabled={!formData.category}
              >
                {subCategories.map((sub) => (
                  <MenuItem key={sub} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 📝 NOTES */}
          <TextField
            type="text"
            label="Notes"
            value={formData.notes}
            onChange={handleChange("notes")}
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* 🗑️ DELETE BUTTON */}
          <ActionButton
            label="Supprimer"
            icon={<DeleteIcon />}
            color="red"
            hoverColor="darkred"
            isPending={deleteTransactions.isPending}
            disabled={selectedTransactionIds.length === 0}
            onClick={() => handleOpenConfirm(selectedTransactionIds)}
          />

          {/* ✏️ MODIFY BUTTON */}
          <ActionButton
            label="Modifier"
            icon={<ChangeCircleIcon />}
            color="#1976d2"
            hoverColor="#1565c0"
            isPending={updateTransaction.isPending}
            disabled={hasErrors || selectedTransactionIds.length !== 1}
            onClick={handleModifyTransaction}
          />

          {/* ➕ ADD BUTTON */}
          <ActionButton
            label="Ajouter"
            icon={<AddCircleIcon />}
            color="green"
            hoverColor="darkgreen"
            isPending={createTransaction.isPending}
            disabled={hasErrors}
            onClick={handleAddTransaction}
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
