import { useMediaQuery, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

const ResponsiveDatePicker = ({ value, onChange }) => {
  const isMobile = useMediaQuery("(max-width:768px)")

  return (
    <>
      {isMobile ? (
        <TextField
          label="Date"
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: "100%",
            // "& .MuiInputBase-input": {
            //   height: "1.5em", 
            //   padding: "12px", 
            // },
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      ) : (
        <DatePicker
          label="Date"
          value={value}
          onChange={onChange}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              size: "small",
              sx: { width: "100%", maxWidth: { sm: "180px" } },
            },
          }}
        />
      )}
    </>
  )
}

export default ResponsiveDatePicker
