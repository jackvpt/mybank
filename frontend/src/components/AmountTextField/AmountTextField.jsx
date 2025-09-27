import { TextField } from "@mui/material"

const AmountTextField = ({ value, onChange, onBlur }) => {
  return (
    <TextField
      type="text"
      label="Montant"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="0.00"
      size="small"
      sx={{ width: "100%", maxWidth: { sm: "240px" } }}
    />
  )
}

export default AmountTextField
