// CSS
import "./RecurringTransactionEdit.scss"

// React imports
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// DEV imports
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { frFR } from "@mui/x-date-pickers/locales"

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
  createTheme,
  ThemeProvider,
} from "@mui/material"

import { Delete, AddCircle, ChangeCircle } from "@mui/icons-material"

/** API imports */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAllSettings } from "../../api/settings"
import { fetchBankAccounts } from "../../api/bankAccounts"
import { fetchAllCategories } from "../../api/categories"
import {
  deleteRecurringTransaction,
  fetchAllRecurringTransactions,
  postRecurringTransaction,
  updateRecurringTransaction,
} from "../../api/recurringTransactions"
import { fr } from "date-fns/locale"

const RecurringTransactionEdit = () => {
  const queryClient = useQueryClient()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [recurringTransactionToDelete, setRecurringTransactionToDelete] =
    useState(null)

  const theme = createTheme({}, frFR)

  const handleOpenConfirm = (id) => {
    setRecurringTransactionToDelete(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (recurringTransactionToDelete) {
      deleteMutation.mutate(recurringTransactionToDelete)
      setConfirmOpen(false)
      setRecurringTransactionToDelete(null)
    }
  }

  const selectedRecurringTransactionId = useSelector(
    (state) => state.settings.selectedRecurringTransactionId
  )

  /**
   * Mutation to post a new recurringtransaction.
   * It uses React Query's useMutation hook to handle the mutation.
   **/
  const addMutation = useMutation({
    mutationFn: postRecurringTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries("recurringTransactions")
      setToastMessage("Transaction récurrente ajoutée")
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la soumission :", error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateRecurringTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries("recurringTransactions")
      setToastMessage("Transaction récurrente modifiée")
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la modification :", error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRecurringTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries("recurringTransactions")
      setToastMessage("Transaction récurrente supprimée")
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error)
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

  // Fetch categories using React Query
  const {
    data: transactionsCategories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories(),
  })

  // Fetch bank accounts using React Query
  const {
    data: bankAccounts,
    isLoading: isLoadingBankAccounts,
    error: bankAccountsError,
  } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: fetchBankAccounts,
  })

  // Fetch transactions using React Query
  const {
    data: recurringTransactions = [],
    isLoading: isLoadingRecurringTransactions,
    error: recurringTransactionsError,
  } = useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: () => fetchAllRecurringTransactions(),
  })

  const transactionTypes = settings ? settings[0].types : []

  const initialFormData = {
    date: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() + 1)
      d.setDate(1)
      return d
    })(),
    account: "",
    type: "autodebit",
    checkNumber: "",
    label: "",
    category: "",
    subCategory: "",
    amount: 0,
    debit: 0,
    credit: 0,
    status: "",
    destination: "",
    periodicity: "monthly",
    notes: "",
  }
  const [formData, setFormData] = useState(initialFormData)

  const periodicities = settings[0]?.periodicities

  useEffect(() => {
    if (selectedRecurringTransactionId) {
      const selected = recurringTransactions.find(
        (recurringTransaction) =>
          recurringTransaction.id === selectedRecurringTransactionId
      )

      if (selected) {
        console.log("selected :>> ", selected.account)
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
  }, [selectedRecurringTransactionId])

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
        id: selectedRecurringTransactionId,
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
    if (!formHasErrors()) addMutation.mutate(formData)
  }

  /**
   * Handles the blur event for the debit field.
   * If the debit value is not empty and is a valid number,
   * it formats the value to two decimal places.
   * @returns {void}
   * @param {string} field
   */
  const handleAmountBlur = () => {
    const value = formData.amount.replace(",", ".")
    if (value !== "" && !isNaN(Number(value))) {
      const formatted = parseFloat(value).toFixed(2)
      formData.amount = formatted
      if (formData.type === "deposit") {
        setFormData((prev) => ({ ...prev, credit: formatted }))
      } else {
        setFormData((prev) => ({ ...prev, debit: formatted }))
      }
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
      formData.label === ""
    )
  }

  if (
    isLoadingSettings ||
    isLoadingBankAccounts ||
    isLoadingCategories ||
    isLoadingRecurringTransactions
  )
    return <p>Loading data...</p>
  if (
    settingsError ||
    bankAccountsError ||
    categoriesError ||
    recurringTransactionsError
  )
    return (
      <p>
        Error loading data: {settingsError.message || bankAccountsError.message}
      </p>
    )

  return (
    <section className="container-transaction-edit">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form>
          {/* DATE PICKER */}
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={fr}
            >
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
            </LocalizationProvider>
          </ThemeProvider>

          {/* BANK ACCOUNT SELECT */}
          <FormControl
            fullWidth
            variant="outlined"
            required
            size="small"
            sx={{ width: "auto", minWidth: 240 }}
          >
            <InputLabel id="account-label">Compte</InputLabel>
            <Select
              labelId="account-label"
              id="account"
              name="account"
              value={formData.account ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  account: e.target.value,
                }))
              }
              label="Compte"
            >
              {bankAccounts.map((account) => (
                <MenuItem key={account._id} value={account.name}>
                  {account.name} - {account.bankAbbreviation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              value={formData.type ?? ""}
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
              <InputLabel id="destination-label">Destination</InputLabel>
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
          <FormControl
            fullWidth
            size="small"
            sx={{ width: "auto", minWidth: 240 }}
          >
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  subCategory: "",
                }))
              }
              label="Catégorie"
            >
              {transactionsCategories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* SUB-CATEGORIES SELECT */}
          <FormControl
            fullWidth
            size="small"
            sx={{ width: "auto", minWidth: 240 }}
          >
            <InputLabel id="subCategory-label">Sous catégorie</InputLabel>
            <Select
              labelId="subCategory-label"
              id="subCategory"
              name="subCategory"
              value={formData.subCategory ?? ""}
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

          {/* PERIODICITY SELECT */}
          <FormControl
            fullWidth
            size="small"
            sx={{ width: "auto", minWidth: 240 }}
          >
            <InputLabel id="periodicity-label">Périodicité</InputLabel>
            <Select
              labelId="periodicity-label"
              id="periodicity"
              name="periodicity"
              value={formData.periodicity ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  periodicity: e.target.value,
                }))
              }
              label="Périodicité"
            >
              {periodicities.map((periodicity) => {
                return (
                  <MenuItem key={periodicity.name} value={periodicity.name}>
                    {periodicity.text}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

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
            startIcon={<Delete />}
            disabled={!selectedRecurringTransactionId}
            onClick={() => handleOpenConfirm(selectedRecurringTransactionId)}
            sx={{
              minWidth: 100,
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
            {deleteMutation.isPending ? "Suppr..." : "Supprimer"}
          </Button>

          {/* MODIFY TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={<ChangeCircle />}
            disabled={formHasErrors()}
            onClick={handleModifyTransaction}
            sx={{
              minWidth: 100,
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
            {updateMutation.isPending ? "Modif..." : "Modifier"}
          </Button>

          {/* ADD TRANSACTION BUTTON */}
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            disabled={formHasErrors()}
            onClick={handleAddTransaction}
            sx={{
              minWidth: 100,
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
            {addMutation.isPending ? "Ajout..." : "Ajouter"}
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
            Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action
            est irréversible.
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

export default RecurringTransactionEdit
