import "./RecurringToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import { useState } from "react"

const RecurringToolBar = () => {
  const dispatch = useDispatch()
  const isRecurringEditWindowVisible = useSelector(
    (state) => state.settings.isRecurringEditWindowVisible
  )

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1)
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

  return (
    <section className="container-recurring-toolbar">
      <div className="toolbar-insert">
        {/* MONTH SELECT */}
        <FormControl
          size="small"
          sx={{
            minWidth: 110,
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

        <Button value="edit" className="toggle-edit-btn" size="small">
          <CalendarMonthIcon fontSize="small" />
        </Button>
      </div>
      <ToggleButton
        value="edit"
        selected={isRecurringEditWindowVisible}
        onChange={() =>
          dispatch({
            type: "settings/setIsRecurringEditWindowVisible",
            payload: !isRecurringEditWindowVisible,
          })
        }
        className={`toggle-edit-btn ${
          isRecurringEditWindowVisible ? "active" : ""
        }`}
        size="small"
      >
        <EditIcon fontSize="small" />
      </ToggleButton>
    </section>
  )
}

export default RecurringToolBar
