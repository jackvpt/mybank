// 🎨 Styles
import "./TransactionEdit.scss"

// ⚛️ React
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// 📅 Date picker
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fr } from "date-fns/locale"

// 🧩 UI components
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListSubheader,
  CircularProgress,
} from "@mui/material"

// 🎯 Icons
import { Delete, AddCircle, ChangeCircle } from "@mui/icons-material"

// 🔄 React Query
import { useQuery } from "@tanstack/react-query"

// 🔌 API calls
import { fetchAllSettings } from "../../api/settings"
import { fetchBankAccounts } from "../../api/bankAccounts"
import { fetchAllCategories } from "../../api/categories"

// 🪝 Custom hooks
import {
  useGetTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransactions,
} from "../../hooks/useTransactions"

const TransactionEdit = () => {
  const dispatch = useDispatch()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [transactionsToDelete, setTransactionsToDelete] = useState([])

  const handleOpenConfirm = (ids) => {
    setTransactionsToDelete(ids)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (transactionsToDelete.length > 0) {
      deleteMutation.mutate(transactionsToDelete)
      setConfirmOpen(false)
      setTransactionsToDelete([])
    }
  }

  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name,
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds,
  )

  // All mutations below come from useTransactions — success/error toasts
  // and "transactions" query invalidation are handled internally via
  // useMutationWithNotification, so no local toast state is needed here.
  const createTransactionMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransactions()

  // Fetch settings using React Query
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchAllSettings(),
  })

  // Fetch categories using React Query
  const {
    data: transactionsCategories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories(),
  })
  const groupedTransactionsCategories = transactionsCategories.reduce(
    (acc, category) => {
      if (!acc[category.type]) acc[category.type] = []
      acc[category.type].push(category)
      return acc
    },
    {},
  )

  // Fetch bank accounts using React Query
  const {
    data: bankAccounts,
    isLoading: isLoadingBankAccounts,
    error: bankAccountsError,
  } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  // Fetch transactions using the shared hook (already returns TransactionModel instances)
  const {
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    data: transactions = [],
  } = useGetTransactions()

  const transactionTypes = settings ? settings[0].types : []

  const initialFormData = {
    date: new Date(),
    accountId: bankAccountId,
    accountName: bankAccountName,
    type: "card",
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
  }
  const [formData, setFormData] = useState(initialFormData)

  const shortcuts = [
    {
      text: "Courses",
      type: "card",
      label: "Courses",
      amount: "",
      category: "Courses",
      subCategory: "",
    },
    {
      text: "Restaurant",
      type: "card",
      label: "Restaurant",
      amount: "",
      category: "Loisirs",
      subCategory: "Restaurant",
    },
    {
      text: "Essence",
      type: "card",
      label: "Essence",
      amount: "",
      category: "Voiture",
      subCategory: "Carburant",
    },
    {
      text: "Salaire HH",
      type: "directdeposit",
      label: "Salaire HeliHolland",
      amount: "last",
      category: "Revenus",
      subCategory: "Salaire",
    },
    {
      text: "Pension",
      type: "directdeposit",
      label: "Pension",
      amount: "last",
      category: "Revenus",
      subCategory: "Pension",
    },
  ]

  useEffect(() => {
    if (selectedTransactionIds.length === 1) {
      const selected = transactions.find(
        (transaction) => transaction.id === selectedTransactionIds[0],
      )

      if (selected) {
        setFormData({
          ...selected,
          date: new Date(selected.date),
          category: selected.category ?? "",
          subCategory: selected.subCategory ?? "",
          type: selected.type ?? "card",
        })
      }
    } else {
      setFormData(initialFormData)
    }
  }, [selectedTransactionIds, transactions])

  /**
   * Handles the modification of a transaction.
   * It checks for form errors and if none are found,
   * it calls the updateMutation to update the transaction.
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleModifyTransaction = (e) => {
    e.preventDefault()
    if (!formHasErrors()) {
      // `selectedTransactionIds` is an array; the button is only enabled
      // when it has exactly one entry, so we unwrap it here instead of
      // passing the whole array as `id`.
      updateMutation.mutate({
        id: selectedTransactionIds[0],
        updatedData: formData,
      })
    }
  }

  /**
   * Add the transaction.
   * @param {Event} e
   */
  const handleAddTransaction = (e) => {
    e.preventDefault()
    if (!formHasErrors()) {
      if (formData.type === "transfer") {
        setFormData((prev) => ({
          ...prev,
          label: `Virement vers ${formData.destination}`,
        }))
        createTransactionMutation.mutate(formData)

        const creditTransaction = {
          ...formData,
          account: formData.destination,
          debit: 0,
          credit: formData.amount,
          label: `Virement depuis ${formData.account}`,
          destination: "",
        }
        createTransactionMutation.mutate(creditTransaction)
      } else {
        createTransactionMutation.mutate(formData)
      }
    }
  }

  /**
   * Handles the blur event for the amount field.
   * If the value is not empty and is a valid number,
   * it formats the value to two decimal places.
   * @returns {void}
   */
  const handleAmountBlur = () => {
    // `formData.amount` can be a number (e.g. reset to `0` by
    // `initialFormData`), and `Number.prototype.replace` doesn't exist —
    // cast to string first to avoid a crash.
    const value = String(formData.amount).replace(",", ".")
    if (value !== "" && !isNaN(Number(value))) {
      const formatted = parseFloat(value).toFixed(2)
      // Route the change through setFormData instead of mutating
      // formData directly, so React re-renders correctly.
      setFormData((prev) => ({
        ...prev,
        amount: formatted,
        ...(prev.type === "deposit"
          ? { credit: formatted }
          : { debit: formatted }),
      }))
    }
  }

  const handleShortcutClick = (shortcut) => {
    let amount = shortcut.amount
    if (amount === "last") {
      const lastTransaction = transactions
        .filter((t) => t.label === shortcut.label)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      amount = lastTransaction ? lastTransaction.amount : 0
    }
    setFormData((prev) => ({
      ...prev,
      type: shortcut.type,
      label: shortcut.label,
      amount,
      category: shortcut.category,
      subCategory: shortcut.subCategory,
    }))
  }

  /**
   * Checks if the form has errors.
   * @returns {boolean} Returns true if the form has errors, false otherwise.
   */
  const formHasErrors = () => {
    return (
      (formData.type === "transfer" && formData.destination === "") ||
      (formData.type === "check" && formData.checkNumber === "") ||
      formData.amount === 0 ||
      formData.amount === "" ||
      isNaN(formData.amount) ||
      (formData.type !== "transfer" && formData.label === "")
    )
  }

  if (
    isLoadingSettings ||
    isLoadingBankAccounts ||
    isLoadingCategories ||
    isLoadingTransactions
  )
    return <p>Loading data...</p>

  // Surface any of the four possible load errors, instead of only
  // settingsError/bankAccountsError like before.
  const loadError =
    settingsError || bankAccountsError || categoriesError || errorTransactions
  if (loadError) return <p>Error loading data: {loadError.message}</p>

  return (
    <section className="container-transaction-edit">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        {/* SHORTCUTS */}
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

        <form>
          {/* DATE PICKER */}
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newValue) =>
              setFormData((prev) => ({ ...prev, date: newValue }))
            }
            format="dd/MM/yyyy"
            sx={{ width: "auto", minWidth: 150, maxWidth: 180 }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />

          {/* TYPE SELECT */}
          <FormControl
            fullWidth
            variant="outlined"
            required
            size="small"
            sx={{ width: "auto", minWidth: 240 }}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              label="Type"
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type.name} value={type.name}>
                  {type.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* CHECK NUMBER */}
          {formData.type === "check" && (
            <TextField
              type="text"
              label="N° chèque"
              value={formData.checkNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  checkNumber: e.target.value,
                }))
              }
              size="small"
              sx={{ width: 120 }}
            />
          )}

          {/* DESTINATION SELECT */}
          {formData.type === "transfer" && (
            <FormControl
              fullWidth
              variant="outlined"
              required
              size="small"
              sx={{ width: "auto", minWidth: 240 }}
            >
              <InputLabel id="type-label">Destination</InputLabel>
              <Select
                labelId="destination-label"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                label="Destination"
              >
                {bankAccounts.map((account) => (
                  <MenuItem key={account._id} value={account.name}>
                    {account.name} - {account.bankAbbreviation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* LABEL */}
          {formData.type !== "transfer" && (
            <TextField
              label="Libellé"
              name="label"
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="Courses"
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={{ width: "auto", minWidth: 350 }}
            />
          )}

          {/* AMOUNT */}
          <TextField
            type="text"
            label="Montant"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            onBlur={() => handleAmountBlur()}
            placeholder="0.00"
            size="small"
            sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
          />

          {/* CATEGORIES SELECT */}
          {formData.type !== "transfer" && (
            <FormControl
              fullWidth
              size="small"
              sx={{ width: "auto", minWidth: 240 }}
            >
              <InputLabel>Catégorie</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    subCategory: "",
                  }))
                }}
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

          {/* SUB-CATEGORIES SELECT */}
          {formData.type !== "transfer" && (
            <FormControl
              fullWidth
              size="small"
              sx={{ width: "auto", minWidth: 240 }}
            >
              <InputLabel>Sous catégorie</InputLabel>
              <Select
                labelId="subCategory-label"
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: e.target.value,
                  }))
                }
                label="Sous catégorie"
                disabled={!formData.category}
              >
                {transactionsCategories
                  .filter((category) => category.name === formData.category)
                  .flatMap((category) =>
                    category.subcategories?.map((sub) => (
                      <MenuItem key={`${category.name}-${sub}`} value={sub}>
                        {sub}
                      </MenuItem>
                    )),
                  )}
              </Select>
            </FormControl>
          )}

          {/* NOTES */}
          <TextField
            type="text"
            label="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* DELETE TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={!deleteMutation.isPending ? <Delete /> : ""}
            disabled={selectedTransactionIds.length === 0}
            onClick={() => handleOpenConfirm(selectedTransactionIds)}
            sx={{
              minWidth: 140,
              backgroundColor: "red",
              color: "#fff",
              "&:hover": {
                backgroundColor: "darkred",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Supprimer"
            )}
          </Button>

          {/* MODIFY TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={!updateMutation.isPending ? <ChangeCircle /> : ""}
            disabled={formHasErrors() || selectedTransactionIds.length !== 1}
            onClick={handleModifyTransaction}
            sx={{
              minWidth: 140,
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Modifier"
            )}
          </Button>

          {/* ADD TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={!createTransactionMutation.isPending ? <AddCircle /> : ""}
            disabled={formHasErrors()}
            onClick={handleAddTransaction}
            sx={{
              minWidth: 140,
              backgroundColor: "green",
              color: "#fff",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            {createTransactionMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Ajouter"
            )}
          </Button>
        </form>
      </LocalizationProvider>

      {/** Modal Dialog Box */}
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