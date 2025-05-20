import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Login.scss"
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValidEmail(form.email) || !isValidPassword(form.password)) return
    // Auth logic here
  }

  return (
    <section className="container-login">
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <FormControl
          fullWidth
          sx={{ mb: 2, maxWidth: 400 }}
          variant="outlined"
          error={submitted && !isValidEmail(form.email)}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
          />
          {submitted && !isValidEmail(form.email) && (
            <FormHelperText>Adresse email invalide</FormHelperText>
          )}
        </FormControl>

        {/* Password Field */}
        <FormControl
          fullWidth
          sx={{ mb: 2, maxWidth: 300 }}
          variant="outlined"
          error={submitted && !isValidPassword(form.password)}
        >
          <InputLabel htmlFor="password">Mot de passe</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Mot de passe"
          />
          {submitted && !isValidPassword(form.password) && (
            <FormHelperText>
              8 caractères min.
              <br />
              Avec majuscule, minuscule, chiffre et caractère spécial
            </FormHelperText>
          )}
        </FormControl>

        <Button type="submit" variant="contained">
          Connexion
        </Button>
      </form>
    </section>
  )
}

export default Login
