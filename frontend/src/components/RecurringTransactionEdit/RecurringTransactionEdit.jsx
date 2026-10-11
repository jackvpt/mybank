// 🎨 Styles
import "./RecurringTransactionEdit.scss"

// ⚛️ React
import { useEffect, useMemo, useState } from "react"

// 🏪 Redux
import { useDispatch, useSelector } from "react-redux"
import { clearSelectedRecurringTransactionIds } from "../../store/features/parametersSlice"

// 📅 Date picker
import { isValid } from "date-fns"

// 🪝 Hooks
import { useGetAllSettings } from "../../hooks/useSettings"
import { useGetAllCategories } from "../../hooks/useCategories"
import { useGetAllBankAccounts } from "../../hooks/useBankAccounts"
import {
  useCreateRecurringTransaction,
  useDeleteRecurringTransactions,
  useGetAllRecurringTransactions,
  useUpdateRecurringTransaction,
} from "../../hooks/useRecurringTransactions"

// 📦 Models
import RecurringTransactionModel from "../../models/RecurringTransactionModel"

// 🧮 Functions
import { formatAmount } from "../../utils/formatNumber"

// 🧩 Components
import CustomTextField from "../SubComponents/CustomTextField/CustomTextField"
import CustomButton from "../SubComponents/CustomButton/CustomButton"
import CustomDatePicker from "../SubComponents/CustomDatePicker/CustomDatePicker"
import CustomSelect from "../SubComponents/CustomSelect/CustomSelect"
import CustomDialog from "../SubComponents/CustomDialog/CustomDialog"

/**
 * Empty form values. Defined outside the component so the reference is
 * stable (usable in effect dependencies without useCallback).
 * The default date is the first day of next month.
 *
 * @returns {object} Initial form data
 */
const getInitialFormData = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(1)

  return {
    date,
    accountName: "",
    type: "autodebit",
    checkNumber: "",
    destination: "",
    label: "",
    amount: 0,
    category: "",
    subCategory: "",
    periodicity: "monthly",
    notes: "",
  }
}

/**
 * Recurring transaction form: create, modify or delete recurring transactions.
 * Edits the recurring transaction when exactly one row is selected in the table.
 *
 * @component
 * @returns {JSX.Element} Rendered RecurringTransactionEdit component
 */
const RecurringTransactionEdit = () => {
  const dispatch = useDispatch()

  // 🗑️ Delete confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [recurringTransactionsToDelete, setRecurringTransactionsToDelete] =
    useState([])

  // 🏪 Redux state
  const selectedRecurringTransactionIds = useSelector(
    (state) => state.parameters.selectedRecurringTransactionIds,
  )

  // 🔄 Mutations (toasts and query invalidation are handled
  // inside useRecurringTransactions via useMutationWithNotification)
  const { mutate: createRecurringTransaction, isPending: isCreating } =
    useCreateRecurringTransaction()
  const { mutate: updateRecurringTransaction, isPending: isUpdating } =
    useUpdateRecurringTransaction()
  const { mutate: deleteRecurringTransactions, isPending: isDeleting } =
    useDeleteRecurringTransactions()

  // 🌐 Data (safe defaults while queries are loading)
  const { data: settings } = useGetAllSettings()
  const transactionTypes = settings?.types ?? []
  const periodicities = settings?.periodicities ?? []
  const { data: transactionsCategories = [] } = useGetAllCategories()
  const { data: bankAccounts = [] } = useGetAllBankAccounts()
  const { data: recurringTransactions = [] } = useGetAllRecurringTransactions()

  // 📝 Form state
  const [formData, setFormData] = useState(getInitialFormData)

  // 🔁 Sync the form with the selection:
  // one selected row -> load it, otherwise (or after a data refresh) -> empty form.
  // This is also what resets the form after a recurring transaction is added.
  useEffect(() => {
    const selected =
      selectedRecurringTransactionIds.length === 1
        ? recurringTransactions.find(
            (recurringTransaction) =>
              recurringTransaction.id === selectedRecurringTransactionIds[0],
          )
        : null

    setFormData(
      selected
        ? {
            ...selected,
            date: new Date(selected.date),
            amount: formatAmount(selected.amount),
            category: selected.category ?? "",
            subCategory: selected.subCategory ?? "",
            type: selected.type ?? "autodebit",
          }
        : getInitialFormData(),
    )
  }, [selectedRecurringTransactionIds, recurringTransactions])

  // 🧠 Derived data
  const isTransfer = formData.type === "transfer"

  // "debit" or "credit", depending on the selected type
  const debitOrCredit = transactionTypes.find(
    (type) => type.name === formData.type,
  )?.category

  // Categories of the selected type
  const categoriesByType = useMemo(
    () =>
      transactionsCategories.filter(
        (category) => category.type === debitOrCredit,
      ),
    [transactionsCategories, debitOrCredit],
  )

  // Sub-categories of the selected category
  const subCategories = useMemo(
    () =>
      transactionsCategories.find(
        (category) => category.name === formData.category,
      )?.subcategories ?? [],
    [transactionsCategories, formData.category],
  )

  // Transfer destinations: every account except the selected one
  const destinationAccounts = useMemo(
    () =>
      bankAccounts.filter((account) => account.name !== formData.accountName),
    [bankAccounts, formData.accountName],
  )

  /**
   * Signed amount: negative for debits, positive for credits,
   * whatever sign the user typed in the form.
   * @returns {number} The signed amount.
   */
  const signedAmount = () => {
    const abs = Math.abs(Number(formData.amount))
    return debitOrCredit === "debit" ? -abs : abs
  }

  // ✅ Validation (computed once per render, used by the buttons and handlers)
  const formHasErrors =
    !isValid(formData.date) ||
    !formData.accountName ||
    !Number.isFinite(signedAmount()) ||
    signedAmount() === 0 ||
    (isTransfer && !formData.destination) ||
    (formData.type === "check" && !formData.checkNumber) ||
    (!isTransfer && !formData.label.trim())

  // ✍️ Form helpers
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChange = (name) => (e) => {
    let value = e.target.value

    if (name === "amount")
      value = value.replace(",", ".").replace(/[^0-9.]/g, "")

    setField(name, value)
  }

  /**
   * Format the amount field to two decimal places on blur.
   * The sign is applied later, when building the payload for the API.
   */
  const handleAmountBlur = () => {
    setField("amount", formatAmount(String(formData.amount ?? "")))
  }

  /**
   * Build the payload sent to the API from the form data.
   * Returns null when the model is invalid, so handlers can bail out.
   *
   * @param {object} [overrides] - Fields to override
   * @returns {object|null}
   */
  const buildPayload = (overrides = {}) => {
    const accountId = bankAccounts.find(
      (account) => account.name === formData.accountName,
    )?.id

    const recurringTransaction = new RecurringTransactionModel({
      ...formData,
      accountId,
      ...overrides,
    })

    if (!recurringTransaction.isValid) {
      console.error(
        "Recurring transaction is not valid",
        recurringTransaction.getErrors(),
      )
      return null
    }

    return recurringTransaction.toPayload()
  }

  // ➕ Create the recurring transaction
  // (transfers have no label field: it is generated from the destination)
  const handleCreateTransaction = () => {
    if (formHasErrors) return

    const payload = buildPayload({
      amount: signedAmount(),
      ...(isTransfer && { label: `Virement vers ${formData.destination}` }),
    })
    if (!payload) return

    createRecurringTransaction(payload)
  }

  // ✏️ Update the selected recurring transaction (button enabled only with exactly one selected)
  const handleUpdateTransaction = () => {
    if (formHasErrors) return

    const payload = buildPayload({
      amount: signedAmount(),
      ...(isTransfer && { label: `Virement vers ${formData.destination}` }),
    })
    if (!payload) return

    updateRecurringTransaction({
      id: selectedRecurringTransactionIds[0],
      updatedData: payload,
    })
  }

  // 🗑️ Delete flow: open the dialog, then confirm
  const handleOpenConfirm = (ids) => {
    setRecurringTransactionsToDelete(ids)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (recurringTransactionsToDelete.length === 0) return

    deleteRecurringTransactions(recurringTransactionsToDelete, {
      onSuccess: () => dispatch(clearSelectedRecurringTransactionIds()),
    })
    setConfirmOpen(false)
    setRecurringTransactionsToDelete([])
  }

  return (
    <section className="container-transaction-edit">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* 📅 DATE PICKER */}
        <CustomDatePicker
          label="Date"
          value={formData.date}
          onChange={(newValue) => setField("date", newValue)}
          format="dd/MM/yyyy"
        />

        {/* 🏦 BANK ACCOUNT SELECT */}
        <CustomSelect
          label="Compte"
          value={formData.accountName ?? ""}
          onChange={(value) => setField("accountName", value)}
          options={bankAccounts.map(({ name }) => ({
            value: name,
            label: name,
          }))}
          size={180}
        />

        {/* 🏷️ TYPE SELECT */}
        <CustomSelect
          label="Type"
          value={formData.type}
          onChange={(value) =>
            // A category belongs to a debit/credit family: reset it with the type
            setFormData((prev) => ({
              ...prev,
              type: value,
              category: "",
              subCategory: "",
            }))
          }
          options={transactionTypes.map(({ name, text }) => ({
            value: name,
            label: text,
          }))}
          size={250}
        />

        {/* 🧾 CHECK NUMBER */}
        {formData.type === "check" && (
          <CustomTextField
            id="checkNumber"
            label="N° chèque"
            value={formData.checkNumber}
            onChange={handleChange("checkNumber")}
            clearField={true}
            copy={false}
            floating={true}
          />
        )}

        {/* 🔀 DESTINATION SELECT */}
        {isTransfer && (
          <CustomSelect
            label="Destination"
            value={formData.destination ?? ""}
            onChange={(value) => setField("destination", value)}
            options={destinationAccounts.map((account) => ({
              value: account.name,
              label: account.bankAbbreviation,
            }))}
          />
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
          size={120}
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
            size={220}
          />
        )}

        {/* 🗃️ SUB-CATEGORY SELECT */}
        {!isTransfer && (
          <CustomSelect
            label="Sous catégorie"
            value={formData.subCategory ?? ""}
            onChange={(value) => setField("subCategory", value)}
            disabled={!formData.category}
            options={subCategories.map((subcategory) => ({
              value: subcategory,
              label: subcategory,
            }))}
            size={220}
          />
        )}

        {/* 🔁 PERIODICITY SELECT */}
        <CustomSelect
          label="Périodicité"
          value={formData.periodicity ?? ""}
          onChange={(value) => setField("periodicity", value)}
          options={periodicities.map((periodicity) => ({
            value: periodicity.name,
            label: periodicity.text,
          }))}
          size={150}
        />

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
          size={200}
        />

        {/* 🗑️ DELETE BUTTON */}
        <CustomButton
          action="delete"
          loading={isDeleting}
          disabled={selectedRecurringTransactionIds.length === 0}
          onClick={() => handleOpenConfirm(selectedRecurringTransactionIds)}
        />

        {/* ✏️ MODIFY BUTTON */}
        <CustomButton
          action="update"
          loading={isUpdating}
          disabled={
            formHasErrors || selectedRecurringTransactionIds.length !== 1
          }
          onClick={handleUpdateTransaction}
        />

        {/* ➕ ADD BUTTON */}
        <CustomButton
          action="create"
          loading={isCreating}
          disabled={formHasErrors}
          onClick={handleCreateTransaction}
        />

        {/* 🔄 RESET BUTTON */}
        <CustomButton
          action="reset"
          onClick={() => {
            setFormData(getInitialFormData())
            dispatch(clearSelectedRecurringTransactionIds())
          }}
        />
      </form>

      {/* ⚠️ Delete confirmation dialog */}
      <CustomDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        confirmLabel="Supprimer"
        danger
      >
        {recurringTransactionsToDelete.length === 1
          ? "Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
          : `Êtes-vous sûr de vouloir supprimer ces ${recurringTransactionsToDelete.length} transactions ? Cette action est irréversible.`}
      </CustomDialog>
    </section>
  )
}

export default RecurringTransactionEdit
