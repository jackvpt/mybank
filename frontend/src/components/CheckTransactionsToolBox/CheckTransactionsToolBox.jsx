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
  setCheckingFinalAmount,
  setCheckingInitialAmount,
} from "../../features/parametersSlice"
import { stringToAmount } from "../../utils/formatNumber"
import { TextField } from "@mui/material"

const CheckTransactionsToolBox = () => {
  const dispatch = useDispatch()

  const [checkDate, setCheckDate] = useState(
    useSelector((state) => state.parameters.checking.date)
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

  return (
    <div className="container-checkTransactions__table__summary">
      {/* DATE PICKER */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <DatePicker
          label="Date du relevé"
          value={checkDate}
          onChange={(newValue) => {
            setCheckDate(newValue)
            dispatch(setCheckDate(newValue))
          }}
          format="dd/MM/yyyy"
          sx={{ width: "auto", minWidth: 150, maxWidth: 180 }}
          slotProps={{
            textField: {
              size: "small",
            },
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
      </LocalizationProvider>
    </div>
  )
}

export default CheckTransactionsToolBox
