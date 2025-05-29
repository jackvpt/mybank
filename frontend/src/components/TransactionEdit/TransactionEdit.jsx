// CSS
import "./TransactionEdit.scss"

// React imports
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// DEV imports
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { CheckCircleOutline } from "@mui/icons-material"

/** API imports */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAllSettings } from "../../api/settings"
import { fetchBankAccounts } from "../../api/bankAccounts"
import { fetchAllCategories } from "../../api/categories"
import {
  fetchTransactionsByAccountName,
  postTransaction,
} from "../../api/transactions"

const TransactionEdit = () => {
  const queryClient = useQueryClient()

  const bankAccountName = useSelector((state) => state.settings.bankAccount)
  const selectedTransactionId = useSelector(
    (state) => state.settings.selectedTransactionId
  )

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions", bankAccountName])
    },
    onError: (error) => {
      console.error("Erreur lors de la soumission :", error)
    },
  })

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
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", bankAccountName],
    queryFn: () => fetchTransactionsByAccountName(bankAccountName),
    enabled: !!bankAccountName,
  })

  const transactionTypes = settings ? settings[0].types : []

  const [formData, setFormData] = useState({
    date: new Date(),
    account: bankAccountName,
    type: "card",
    checkNumber: "",
    label: "",
    category: "",
    subCategory: "",
    amount: 0,
    debit: 0,
    credit: 0,
    status: null,
    destination: "",
    periodicity: "",
    notes: "",
  })

  useEffect(() => {
    if (selectedTransactionId) {
      const selected = transactions.find(
        (transaction) => transaction.id === selectedTransactionId
      )

      if (selected) {
        setFormData({
          ...selected,
          date: new Date(selected.date),
          amount: (selected.debit ?? selected.credit ?? 0).toFixed(2),
          category: selected.category ?? "",
          subCategory: selected.subCategory ?? "",
          type: selected.type ?? "card",
        })
      }

      console.log("formData :>> ", selected)
    }
  }, [selectedTransactionId])

  /**
   * Submits the transaction form data.
   * @param {Event} e
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
    console.log("Transaction sent :", formData)
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
      isNaN(formData.amount) ||
      formData.label === ""
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleSubmit}>
          {/* DATE PICKER */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              value={formData.category}
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
          <Button
            type="submit"
            variant="contained"
            startIcon={<CheckCircleOutline />}
            disabled={formHasErrors()}
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
            {mutation.isPending ? "Envoi..." : "Ajouter"}
          </Button>
        </form>
      </LocalizationProvider>
    </section>
  )
}

export default TransactionEdit
