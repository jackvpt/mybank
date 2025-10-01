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
          InputLabelProps={{
            shrink: true, // évite que le label chevauche
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              height: "56px", // même hauteur qu'un TextField standard
            },
            "& .MuiInputBase-input": {
              padding: "16.5px 14px", // padding interne identique aux autres champs
              fontSize: "1rem",
              boxSizing: "border-box",
            },
            "& input[type='date']::-webkit-calendar-picker-indicator": {
              cursor: "pointer",
              marginRight: 2,
            },
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
