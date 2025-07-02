import "./CheckTransactionsToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import { ToggleButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import { setIsCheckTransactionsEditWindowVisible } from "../../features/parametersSlice"

const CheckTransactionsToolBar = () => {
  const dispatch = useDispatch()
  const isCheckTransactionsEditWindowVisible = useSelector(
    (state) => state.parameters.isCheckTransactionsEditWindowVisible
  )
  return (
    <section className="container-toolbar">
      <ToggleButton
        value="edit"
        selected={isCheckTransactionsEditWindowVisible}
        onChange={() =>
          dispatch(
            setIsCheckTransactionsEditWindowVisible(
              !isCheckTransactionsEditWindowVisible
            )
          )
        }
        className={`toggle-edit-btn ${
          isCheckTransactionsEditWindowVisible ? "active" : ""
        }`}
        size="small"
      >
        <EditIcon fontSize="small" />
      </ToggleButton>
    </section>
  )
}

export default CheckTransactionsToolBar
