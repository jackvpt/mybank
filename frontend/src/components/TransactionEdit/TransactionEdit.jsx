import "./TransactionEdit.scss"
import { useState } from "react"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { fetchAllSettings } from "../../api/settings"
import { useQuery } from "@tanstack/react-query"

const TransactionEdit = () => {
  // Fetch settings using React Query
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchAllSettings(),
  })

  const transactionTypes = settings ? settings[0].types : []

  const [formData, setFormData] = useState({
    date: new Date(),
    account: "",
    type: "card",
    checkNumber: "",
    label: "",
    category: "",
    subCategory: "",
    debit: 0,
    credit: 0,
    status: null,
    destination: "",
    periodicity: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formElement = e.target
    if (!formElement.checkValidity()) {
      formElement.reportValidity()
      return
    }
  }

  if (isLoadingSettings) return <p>Loading settings...</p>
  if (settingsError)
    return <p>Error loading settings: {settingsError.message}</p>

  /**
   * Handles the blur event for the debit field.
   * If the debit value is not empty and is a valid number,
   * it formats the value to two decimal places.
   * @returns {void}
   * @param {string} field 
   */
  const handleAmountBlur = (field) => {
    const value = formData[field].replace(",", ".")
    if (value !== "" && !isNaN(Number(value))) {
      const formatted = parseFloat(value).toFixed(2)
      setFormData((prev) => ({ ...prev, [field]: formatted }))
    }
  }

  return (
    <section className="container-transaction-edit">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {" "}
            {/* Ensure you have this */}
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, date: newValue }))
              }
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>

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

          <TextField
            type="text"
            label="Débit"
            value={formData.debit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                debit: e.target.value,
              }))
            }
            onBlur={() => handleAmountBlur("debit")}
            placeholder="0.00"
            size="small"
            sx={{ width: 120 }}
          />
          <TextField
            type="text"
            label="Crédit"
            value={formData.credit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                credit: e.target.value,
              }))
            }
            onBlur={() => handleAmountBlur("credit")}
            placeholder="0.00"
            size="small"
            sx={{ width: 120 }}
          />
        </form>
      </LocalizationProvider>
    </section>
  )
}

export default TransactionEdit
