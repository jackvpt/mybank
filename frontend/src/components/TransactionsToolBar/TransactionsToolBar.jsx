import "./TransactionsToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import { ToggleButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import { setIsTransactionEditWindowVisible } from "../../features/parametersSlice"

const RecurringToolBar = () => {
  const dispatch = useDispatch()
  const isTransactionEditWindowVisible = useSelector(
    (state) => state.parameters.isTransactionEditWindowVisible
  )
  return (
    <section className="container-toolbar">
      <ToggleButton
        value="edit"
        selected={isTransactionEditWindowVisible}
        onChange={() =>
          dispatch(
            setIsTransactionEditWindowVisible(!isTransactionEditWindowVisible)
          )
        }
        className={`toggle-edit-btn ${
          isTransactionEditWindowVisible ? "active" : ""
        }`}
        size="small"
      >
        <EditIcon fontSize="small" />
      </ToggleButton>
    </section>
  )
}

export default RecurringToolBar
