// 🎨 Styles
import "./CheckTransactionsToolBox.scss"

// ⚛️ React
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// DEV imports
import {
  setCheckingCurrentAmount,
  setCheckingFinalAmount,
  setCheckingInitialAmount,
} from "../../store/features/parametersSlice"

// 🧮 Functions
import { entityToAmount, formatAmount } from "../../utils/formatNumber"

// 🧱 MUI components
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { validateTransactions } from "../../api/transactions.api"

// 🧩 Components
import CustomDatePicker from "../SubComponents/CustomDatePicker/CustomDatePicker"
import CustomTextField from "../SubComponents/CustomTextField/CustomTextField"
import CustomButton from "../SubComponents/CustomButton/CustomButton"

const CheckTransactionsToolBox = () => {
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // 🏪 Redux state
  const bankAccountName = useSelector((state) => state.parameters.bankAccount)
  const noneTransactionChecked = useSelector(
    (state) => state.parameters.checking.noneTransactionChecked,
  )
  const stateCheckDate = new Date(
    useSelector((state) => state.parameters.checking.date),
  )

  const validateMutation = useMutation({
    mutationFn: validateTransactions,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions", bankAccountName])
      setToastMessage(`${data.modifiedCount} transaction(s) validée(s)`)
      setToastOpen(true)
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error.message)
    },
  })

  const [checkDate, setCheckDate] = useState(stateCheckDate)

  const [checkInitialAmount, setCheckInitialAmount] = useState(
    useSelector((state) => state.parameters.checking.initialAmount).toFixed(2),
  )
  const [checkFinalAmount, setCheckFinalAmount] = useState(
    useSelector((state) => state.parameters.checking.finalAmount).toFixed(2),
  )
  const checkCurrentAmount = useSelector(
    (state) => state.parameters.checking.currentAmount,
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
    <div className="container__checkTransactionsToolbox">
      {/* DATE PICKER */}
      <CustomDatePicker
        label="Date du relevé"
        value={checkDate}
        onChange={(newValue) => {
          setCheckDate(newValue)
          dispatch(setCheckDate(newValue))
        }}
        format="dd/MM/yyyy"
      />

      {/* INITIAL AMOUNT */}
      <CustomTextField
        id="checkInitialAmount"
        label="Solde initial"
        value={
          checkInitialAmount === 0
            ? ""
            : String(checkInitialAmount ?? "").replace("-", "")
        }
        onChange={(e) => setCheckInitialAmount(e.target.value)}
        onBlur={(e) => setCheckInitialAmount(formatAmount(e.target.value))}
        clearField={true}
        copy={false}
        floating={true}
        size={150}
      />

      {/* FINAL AMOUNT */}
      <CustomTextField
        id="checkFinalAmount"
        label="Solde final"
        value={
          checkFinalAmount === 0
            ? ""
            : String(checkFinalAmount ?? "").replace("-", "")
        }
        onChange={(e) => setCheckFinalAmount(e.target.value)}
        onBlur={(e) => setCheckFinalAmount(formatAmount(e.target.value))}
        clearField={true}
        copy={false}
        floating={true}
        size={150}
      />

      {/* CURRENT AMOUNT */}
      <CustomTextField
        id="checkCurrentAmount"
        label="Solde actuel"
        value={
          checkCurrentAmount === 0
            ? ""
            : String(checkCurrentAmount ?? "").replace("-", "")
        }
        clearField={false}
        copy={false}
        floating={true}
        disabled={true}
        size={150}
      />

      {/* DIFFERENCE AMOUNT */}
      <CustomTextField
        id="checkDifference"
        label="Différence"
        value={(checkCurrentAmount - checkFinalAmount).toFixed(2)}
        clearField={false}
        copy={false}
        floating={true}
        disabled={true}
        size={150}
      />

      {/* VALIDATION BUTTON */}
      <CustomButton
        action="none"
        onClick={handleValidateCheck}
        disabled={
          checkCurrentAmount !== checkFinalAmount || noneTransactionChecked
        }
        children="Valider"
      />

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
