// CSS
import "./TransactionEdit.scss"

// React imports
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// DEV imports
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fr } from "date-fns/locale"

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListSubheader,
  CircularProgress,
} from "@mui/material"

import { Delete, AddCircle, ChangeCircle } from "@mui/icons-material"

/** API imports */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAllSettings } from "../../api/settings"
import { updateTransaction, deleteTransactions } from "../../api/transactions"

import { useAddTransaction } from "../../hooks/useAddTransaction"
import ResponsiveDatePicker from "../sub-components/ResponsiveDatePicker/ResponsiveDatePicker"
import AmountTextField from "../AmountTextField/AmountTextField"
import ResponsiveSelect from "../sub-components/ResponsiveSelect/ResponsiveSelect"
import { useFetchBankAccounts } from "../../hooks/useFetchBankAccounts"
import { useFetchTransactions } from "../../hooks/useFetchTransactions"
import { useFetchCategories } from "../../hooks/useFetchCategories"

const TransactionEdit = () => {
  const queryClient = useQueryClient()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
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
    (state) => state.parameters.bankAccount.name
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds
  )

  const addTransactionMutation = useAddTransaction({
    onSuccess: () => {
      setToastMessage("Transaction ajoutée")
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Error adding occupancy:", error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries("transactions")
      setToastMessage("Transaction modifiée")
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la modification :", error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransactions,
    onSuccess: (data) => {
      queryClient.invalidateQueries("transactions")
      setToastMessage(`${data.deletedCount} transaction(s) supprimée(s)`)
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error.message)
    },
  })

  /**
   * Handles the closing of the toast notification.
   * @param {Event} event - The event that triggered the close.
   * @param {string} reason - The reason for closing the toast (e.g., "clickaway").
   */
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return
    setToastOpen(false)
  }

  // Fetch settings using React Query
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchAllSettings(),
  })

  /**
   * Fetch categories using React Query
   */
  const {
    data: transactionsCategories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useFetchCategories()

  const groupedTransactionsCategories = transactionsCategories.reduce(
    (acc, category) => {
      if (!acc[category.type]) acc[category.type] = []
      acc[category.type].push(category)
      return acc
    },
    {}
  )

  // Fetch bank accounts using React Query
  const {
    isLoading: isLoadingBankAccounts,
    error: bankAccountsError,
    data: bankAccounts,
  } = useFetchBankAccounts()

  // Fetch transactions using React Query
  const {
    isLoading: isLoadingTransactions,
    error: transactionsError,
    data: transactions = [],
  } = useFetchTransactions()

  const transactionsByAccountId = transactions.filter(
    (transaction) => transaction.accountId === bankAccountId
  )

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
    rawAmount: "",
    amount: 0,
    debit: 0,
    credit: 0,
    status: null,
    destination: "",
    periodicity: null,
    notes: "",
  }
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (selectedTransactionIds.length === 1) {
      const selected = transactionsByAccountId.find(
        (transaction) => transaction.id === selectedTransactionIds[0]
      )
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          date: new Date(selected.date),
          rawAmount: Math.abs(selected.amount).toFixed(2),
          label: selected.label ?? "",
          category: selected.category ?? "",
          subCategory: selected.subCategory ?? "",
          type: selected.type ?? "card",
          notes: selected.notes ?? "",
          // keep other fields unchanged if needed
        }))
      }
    } else if (selectedTransactionIds.length === 0) {
      setFormData(initialFormData)
    }
  }, [selectedTransactionIds])

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
      updateMutation.mutate({
        id: selectedTransactionIds,
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
      const debitTransaction = {
        ...formData,
        label: `Virement vers ${formData.destination}`,
      }

      const creditTransaction = {
        ...formData,
        account: formData.destination,
        debit: 0,
        credit: formData.amount,
        label: `Virement depuis ${formData.account}`,
        destination: "",
      }

      switch (formData.type) {
        case "transfer":
          setFormData((prev) => ({
            ...prev,
            label: `Virement vers ${formData.destination}`,
          }))
          addTransactionMutation.mutate(debitTransaction)

          addTransactionMutation.mutate(creditTransaction)
          break

        default:
          addTransactionMutation.mutate(formData)
          break
      }
    }
  }

  /**
   * Handles the blur event for the debit field.
   * If the debit value is not empty and is a valid number,
   * it formats the value to two decimal places.
   * @returns {void}
   * @param {string} field
   */
  const handleAmountBlur = () => {
    const amountStr = String(formData.rawAmount).replace(",", ".")
    if (amountStr !== "" && !isNaN(Number(amountStr))) {
      const numericAmount = parseFloat(amountStr)

      setFormData((prev) => {
        let newAmount = numericAmount
        let newLabel = prev.label

        switch (prev.type) {
          case "card":
          case "check":
            newAmount = -Math.abs(numericAmount)
            break

          case "transfer":
            newAmount = -Math.abs(numericAmount)
            newLabel = `Virement vers ${prev.destination}`
            break

          case "directdeposit":
            newAmount = Math.abs(numericAmount)
            break

          default:
            newAmount = -Math.abs(numericAmount)
            break
        }

        return {
          ...prev,
          amount: parseFloat(newAmount.toFixed(2)),
          rawAmount: numericAmount.toFixed(2),
          label: newLabel,
        }
      })
    }
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
  if (
    settingsError ||
    bankAccountsError ||
    categoriesError ||
    transactionsError
  )
    return (
      <p>
        Error loading data: {settingsError.message || bankAccountsError.message}
      </p>
    )

  return (
    <section className="container-transaction-edit">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <form>
          <ResponsiveDatePicker
            value={formData.date}
            onChange={(newValue) =>
              setFormData((prev) => ({ ...prev, date: newValue }))
            }
          />

          {/* TYPE SELECT */}
          <ResponsiveSelect
            label="Type"
            name="type"
            value={formData.type}
            onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
            options={transactionTypes}
          />

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
              sx={{ width: "100%", maxWidth: { sm: "240px" } }}
            />
          )}

          {/* DESTINATION SELECT */}
          {formData.type === "transfer" && (
            <FormControl
              fullWidth
              variant="outlined"
              required
              size="small"
              sx={{ width: "100%", maxWidth: { sm: "240px" } }}
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
              sx={{ width: "100%", maxWidth: { sm: "350px" } }}
            />
          )}

          {/* AMOUNT */}
          <AmountTextField
            value={formData.rawAmount}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                rawAmount: value,
              }))
            }
            onBlur={handleAmountBlur}
          />

          {/* CATEGORIES SELECT */}
          {formData.type !== "transfer" && (
            <FormControl
              fullWidth
              size="small"
              sx={{
                width: "100%", // Full width for mobile
                maxWidth: { sm: "180px" }, // Maximum width for tablet and laptop
                minWidth: 240, // Ensuring a minimum width for the component
              }}
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
                        key={category.id}
                        value={category.name}
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {category.name}
                      </MenuItem>
                    )),
                  ]
                )}
              </Select>
            </FormControl>
          )}

          {/* SUB-CATEGORIES SELECT */}
          {formData.type !== "transfer" && (
            <FormControl
              fullWidth
              size="small"
              sx={{
                width: "100%", // Full width for mobile
                maxWidth: { sm: "180px" }, // Maximum width for tablet and laptop
                minWidth: 240, // Ensuring a minimum width for the component
              }}
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
                    ))
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
            sx={{
              width: "100%",
              minWidth: { sm: "200px" },
              maxWidth: { sm: "350px" },
            }}
          />

          {/* DELETE TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={!deleteMutation.isPending ? <Delete /> : ""}
            disabled={selectedTransactionIds.length === 0}
            onClick={() => handleOpenConfirm(selectedTransactionIds)}
            sx={{
              width: "100%",
              maxWidth: { sm: "160px" },
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
              width: "100%",
              maxWidth: { sm: "160px" },
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
            startIcon={!addTransactionMutation.isPending ? <AddCircle /> : ""}
            disabled={formHasErrors()}
            onClick={handleAddTransaction}
            sx={{
              width: "100%",
              maxWidth: { sm: "160px" },
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
            {addTransactionMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Ajouter"
            )}
          </Button>
        </form>
      </LocalizationProvider>

      {/* Toast notification for success messages */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

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
