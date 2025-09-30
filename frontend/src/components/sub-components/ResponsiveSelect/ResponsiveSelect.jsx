import {
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material"

const ResponsiveSelect = ({ label, value, onChange, options, name }) => {
  const isMobile = useMediaQuery("(max-width:768px)")

  return (
    <>
      {isMobile ? (
        <TextField
          select
          native
          label={label}
          name={name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: "100%",
            "& .MuiInputBase-input": {
              height: "1.5em",
              padding: "12px",
            },
          }}
          slotProps={{
            select: {
              native: true,
            },
          }}
        >
          {options.map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.text}
            </option>
          ))}
        </TextField>
      ) : (
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          sx={{ width: "100%", maxWidth: { md: "240px" } }}
        >
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label={label}
          >
            {options.map((opt) => (
              <MenuItem key={opt.name} value={opt.name}>
                {opt.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  )
}

export default ResponsiveSelect
