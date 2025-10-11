// CSS
import "./CheckTransactionsToolBox.scss"

// React imports
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// DEV imports
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fr } from "date-fns/locale"
import {
  setCheckingCurrentAmount,
  setCheckingDate,
  setCheckingFinalAmount,
  setCheckingInitialAmount,
} from "../../features/parametersSlice"
import { stringToAmount } from "../../utils/formatNumber"
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { validateTransactions } from "../../api/transactions"
import { ChangeCircle } from "@mui/icons-material"
import ResponsiveDatePicker from "../sub-components/ResponsiveDatePicker/ResponsiveDatePicker"

const CheckTransactionsToolBox = () => {
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const bankAccountName = useSelector((state) => state.parameters.bankAccount.name)
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  
  const noneTransactionChecked = useSelector(
    (state) => state.parameters.checking.noneTransactionChecked
  )

  const validateMutation = useMutation({
    mutationFn: validateTransactions,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions", bankAccountName])

      setToastMessage(`${data.modifiedCount} transaction(s) validée(s)`)
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la validation :", error.message)
    },
  })

  const [checkDate, setCheckDate] = useState(
    new Date(useSelector((state) => state.parameters.checking.date))
  )
  const [checkInitialAmount, setCheckInitialAmount] = useState(
    useSelector((state) => state.parameters.checking.initialAmount).toFixed(2)
  )
  const [checkFinalAmount, setCheckFinalAmount] = useState(
    useSelector((state) => state.parameters.checking.finalAmount).toFixed(2)
  )
  const checkCurrentAmount = useSelector(
    (state) => state.parameters.checking.currentAmount
  ).toFixed(2)

  const handleValidateCheck = (e) => {
    e.preventDefault()
    validateMutation.mutate()
    setCheckingCurrentAmount(0)
  }

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return
    setToastOpen(false)
  }

  return (
    <div className="container-checkTransactions__table__summary">
      {/* DATE PICKER */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <ResponsiveDatePicker
          value={checkDate}
          onChange={(newValue) => {
            setCheckDate(newValue)
            dispatch(setCheckingDate(newValue))
          }}
        />

        {/* INITIAL AMOUNT */}
        <TextField
          type="text"
          label="Solde initial"
          value={checkInitialAmount}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setCheckInitialAmount(e.target.value)}
          onBlur={(e) => {
            const formattedValue = stringToAmount(e.target.value)
            setCheckInitialAmount(formattedValue.toFixed(2))
            dispatch(setCheckingInitialAmount(formattedValue))
          }}
          placeholder="0.00"
          size="small"
          sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
        />

        {/* FINAL AMOUNT */}
        <TextField
          type="text"
          label="Solde final"
          value={checkFinalAmount}
          onChange={(e) => setCheckFinalAmount(e.target.value)}
          onBlur={(e) => {
            const formattedValue = stringToAmount(e.target.value)
            setCheckFinalAmount(formattedValue.toFixed(2))
            dispatch(setCheckingFinalAmount(formattedValue))
          }}
          placeholder="0.00"
          size="small"
          sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
        />

        {/* CURRENT AMOUNT */}
        <TextField
          type="text"
          label="Solde actuel"
          disabled
          value={checkCurrentAmount}
          placeholder="0.00"
          size="small"
          sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
        />

        {/* DIFFERENCE AMOUNT */}
        <TextField
          type="text"
          label="Différence"
          disabled
          value={(checkCurrentAmount - checkFinalAmount).toFixed(2)}
          placeholder="0.00"
          size="small"
          sx={{ width: "auto", maxWidth: 120, minWidth: 120 }}
        />

        {/* VALIDATION BUTTON */}
        <Button
          variant="contained"
          disabled={
            checkCurrentAmount !== checkFinalAmount || noneTransactionChecked
          }
          onClick={handleValidateCheck}
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
          {validateMutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Valider le relevé"
          )}
        </Button>
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
    </div>
  )
}

export default CheckTransactionsToolBox
