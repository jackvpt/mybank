// 🎨 Styles
import "./CheckTransactionsToolBox.scss"

// ⚛️ React
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

// DEV imports
import { setCheckingCurrentAmount } from "../../store/features/parametersSlice"

// 🧮 Functions
import { formatAmount } from "../../utils/formatNumber"

// 🧩 Components
import CustomDatePicker from "../SubComponents/CustomDatePicker/CustomDatePicker"
import CustomTextField from "../SubComponents/CustomTextField/CustomTextField"
import CustomButton from "../SubComponents/CustomButton/CustomButton"
import {
  useGetAllTransactions,
  useValidateTransactions,
} from "../../hooks/useTransactions"

const CheckTransactionsToolBox = () => {
  const { data: transactions = [] } = useGetAllTransactions()

  const totalPointedTransactions = transactions
    .filter((transaction) => transaction.status === "pointed")
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0)

  const dispatch = useDispatch()

  // 🏪 Redux state
  const stateCheckDate = new Date(
    useSelector((state) => state.parameters.checking.date),
  )

  const validateMutation = useValidateTransactions()

  const [checkDate, setCheckDate] = useState(stateCheckDate)

  const [checkInitialAmount, setCheckInitialAmount] = useState(
    useSelector((state) => state.parameters.checking.initialAmount).toFixed(2),
  )
  const [checkFinalAmount, setCheckFinalAmount] = useState(
    useSelector((state) => state.parameters.checking.finalAmount).toFixed(2),
  )


  const handleValidateCheck = () => {
    validateMutation.mutate(undefined, {
      onSuccess: () => setCheckingCurrentAmount(0),
    })
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
        value={checkInitialAmount}
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
        value={checkFinalAmount}
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
        value={(
          parseFloat(checkInitialAmount) + parseFloat(totalPointedTransactions)
        ).toFixed(2)}
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
        value={(
          parseFloat(checkFinalAmount) -
          parseFloat(checkInitialAmount) -
          parseFloat(totalPointedTransactions)
        ).toFixed(2)}
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
          parseFloat(checkFinalAmount) !==
          parseFloat(checkInitialAmount) + parseFloat(totalPointedTransactions)
        }
        children="Valider"
      />
    </div>
  )
}

export default CheckTransactionsToolBox
