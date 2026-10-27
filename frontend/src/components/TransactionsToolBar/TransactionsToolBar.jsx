import "./TransactionsToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import { ToggleButton } from "@mui/material"

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"

import { setIsTransactionEditWindowVisible } from "../../store/features/parametersSlice"

const TransactionsToolBar = () => {
  const dispatch = useDispatch()
  const isTransactionEditWindowVisible = useSelector(
    (state) => state.parameters.isTransactionEditWindowVisible,
  )
  return (
    <section className="container-toolbar">
      <ToggleButton
        value="edit"
        selected={isTransactionEditWindowVisible}
        onChange={() =>
          dispatch(
            setIsTransactionEditWindowVisible(!isTransactionEditWindowVisible),
          )
        }
        className={`toggle-edit-btn ${
          isTransactionEditWindowVisible ? "active" : ""
        }`}
        size="small"
      >
        <FontAwesomeIcon icon={faPen} />
      </ToggleButton>
    </section>
  )
}

export default TransactionsToolBar
