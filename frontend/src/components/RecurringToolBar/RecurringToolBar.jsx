import "./RecurringToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import {
  Alert,
  Button,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  ToggleButton,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ListAddIcon from "@mui/icons-material/PlaylistAdd"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchAllRecurringTransactions,
  updateRecurringTransaction,
} from "../../api/recurringTransactions"
import { setIsRecurringEditWindowVisible } from "../../features/parametersSlice"
import { useAddRecurringTransactions } from "../../hooks/useAddRecurringTransactions"

const RecurringToolBar = () => {
  // Fetch recurring transactions using React Query
  const {
    data: recurringTransactions = [],
    isLoading: isLoadingRecurringTransactions,
    error: recurringTransactionsError,
  } = useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: () => fetchAllRecurringTransactions(),
  })

  const dispatch = useDispatch()
  const isRecurringEditWindowVisible = useSelector(
    (state) => state.parameters.isRecurringEditWindowVisible
  )

  const queryClient = useQueryClient()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  /**
   * Handles the closing of the toast notification.
   * @param {Event} event - The event that triggered the close.
   * @param {string} reason - The reason for closing the toast (e.g., "clickaway").
   */
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return
    setToastOpen(false)
  }

  const addTransactionsMutation = useAddRecurringTransactions({
    onSuccess: (results) => {
      queryClient.invalidateQueries("recurringTransactions")
      setToastMessage(
        `${results.length} transaction${results.length > 1 ? "s" : ""} ajoutée${
          results.length > 1 ? "s" : ""
        }`
      )
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Error with recurring transactions:", error)
    },
  })

  /**
   * Mutation to update a recurring transaction.
   * It uses React Query's useMutation hook to handle the mutation.
   *
   */
  const updateRecurringMutation = useMutation({
    mutationFn: updateRecurringTransaction,

    onError: (error) => {
      console.error("Erreur lors de la modification :", error)
    },
  })

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const months = [
    { value: 0, label: "Janvier" },
    { value: 1, label: "Février" },
    { value: 2, label: "Mars" },
    { value: 3, label: "Avril" },
    { value: 4, label: "Mai" },
    { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" },
    { value: 7, label: "Août" },
    { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" },
    { value: 10, label: "Novembre" },
    { value: 11, label: "Décembre" },
  ]

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handleAddRecurring = () => {
    const newTransactions = []

    recurringTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)

      if (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      ) {
        const originalTransaction = { ...transaction }

        switch (transaction.type) {
          case "transfer":
            {
              const creditTransaction = {
                ...transaction,
                type: "credit",
                label: `Virement depuis ${transaction.account}`,
                account: transaction.destination,
                debit: 0,
                credit: transaction.amount,
                destination: "",
              }
              newTransactions.push(creditTransaction)
            }
            break
          case "autodebit":
            break
          case "directdeposit":
            break
        }

        newTransactions.push(originalTransaction)

        // const updatedTransaction = {
        //   ...transaction,
        //   date: new Date(
        //     transactionDate.setMonth(transactionDate.getMonth() + 1)
        //   ),
        // }

        // updateRecurringMutation.mutate({
        //   id: transaction.id,
        //   updatedData: updatedTransaction,
        // })
      }
    })

    if (newTransactions.length > 0) {
      console.log("newTransactions :>> ", newTransactions)
      // addTransactionsMutation.mutate(newTransactions)
    } else {
      setToastMessage("Aucune transaction récurrente trouvée pour ce mois")
      setToastOpen(true)
    }
  }

  if (isLoadingRecurringTransactions) {
    return <div>Loading...</div>
  }

  if (recurringTransactionsError) {
    return (
      <div>
        Error loading recurring transactions:{" "}
        {recurringTransactionsError.message}
      </div>
    )
  }

  return (
    <section className="container-recurring-toolbar">
      <div className="toolbar-insert">
        <CalendarMonthIcon />

        {/* MONTH SELECT */}
        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiInputBase-root": {
              height: 28,
              fontSize: "0.75rem",
              padding: "0 6px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.75rem",
              top: "-5px",
            },
            "& .MuiSelect-select": {
              padding: "4px 8px",
            },
          }}
        >
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label="Mois"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* YEAR INPUT */}
        <FormControl
          sx={{
            width: 80,
            "& .MuiOutlinedInput-notchedOutline": {
              padding: 0,
              border: "none",
            },
            "& .MuiInputBase-root": {
              height: 28,
              fontSize: "0.75rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.75rem",
              top: "-5px",
            },
            "& input": {
              textAlign: "center",
            },
          }}
        >
          <TextField
            type="number"
            variant="outlined"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            slotProps={{
              inputProps: {
                style: { textAlign: "center" },
              },
            }}
          />
        </FormControl>

        <Button
          value="edit"
          className="toggle-edit-btn"
          size="small"
          onClick={handleAddRecurring}
        >
          <ListAddIcon fontSize="small" />
        </Button>
      </div>
      <ToggleButton
        value="edit"
        selected={isRecurringEditWindowVisible}
        onChange={() =>
          dispatch(
            setIsRecurringEditWindowVisible(!isRecurringEditWindowVisible)
          )
        }
        className={`toggle-edit-btn ${
          isRecurringEditWindowVisible ? "active" : ""
        }`}
        size="small"
      >
        <EditIcon fontSize="small" />
      </ToggleButton>

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
    </section>
  )
}

export default RecurringToolBar
