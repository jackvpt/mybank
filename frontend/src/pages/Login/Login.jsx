import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Login.scss"
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useLogin } from "../../hooks/useLogin"

const Login = () => {
  const loginMutation = useLogin()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    switch (name) {
      case "email":
        setIsFormValid(isValidEmail(value))
        break
    }
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValidEmail(formData.email)) return
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
      remember: formData.rememberMe,
    })
  }

  return (
    <section className="container-login">
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <FormControl
          fullWidth
          sx={{ mb: 2, maxWidth: 400 }}
          variant="outlined"
          error={submitted && !isValidEmail(formData.email)}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleFormChange}
          />
          {submitted && !isValidEmail(formData.email) && (
            <FormHelperText>Adresse email invalide</FormHelperText>
          )}
        </FormControl>

        {/* Password Field */}
        <FormControl
          fullWidth
          sx={{ mb: 2, maxWidth: 300 }}
          variant="outlined"
          error={submitted}
        >
          <InputLabel htmlFor="password">Mot de passe</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleFormChange}
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
        </FormControl>

        {/** Remember Me Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.rememberMe}
              name="rememberMe"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: e.target.checked,
                }))
              }
            />
          }
          label="Se souvenir de moi"
        />

        <Button type="submit" variant="contained" disabled={!isFormValid}>
          Connexion
        </Button>
      </form>
    </section>
  )
}

export default Login
