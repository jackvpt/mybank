import { useMediaQuery, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"

const ResponsiveDatePicker = ({ value, onChange }) => {
  const isMobile = useMediaQuery("(max-width:768px)")

  return (
    <>
      {isMobile ? (
        <MobileDatePicker
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
