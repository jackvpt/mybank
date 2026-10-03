// CSS
import "./CustomButton.scss"

const Svg = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)

const actionConfig = {
  create: {
    label: "Ajouter",
    icon: <Svg d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />,
  },
  update: {
    label: "Modifier",
    icon: (
      <Svg d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    ),
  },
  delete: {
    label: "Supprimer",
    icon: (
      <Svg d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    ),
  },
  reset: {
    label: "Reset",
    icon: (
      <Svg d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z" />
    ),
  },
}

const CustomButton = ({
  action = "create",
  loading = false,
  disabled = false,
  type = "button", // Avoid submitting forms by default, unless explicitly set to "submit"
  className = "",
  children,
  ...props
}) => {
  const config = actionConfig[action] ?? actionConfig.create

  return (
    <button
      type={type}
      className={`custom-btn custom-btn--${action} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="custom-btn__spinner" aria-hidden="true" />
      ) : (
        config.icon
      )}
      {children || config.label}
    </button>
  )
}

export default CustomButton
