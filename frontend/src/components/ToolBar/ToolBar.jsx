import "./ToolBar.scss"
import { useSelector, useDispatch } from "react-redux"
import { ToggleButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

const ToolBar = () => {
  const dispatch = useDispatch()
  const isEditWindowVisible = useSelector(
    (state) => state.settings.isEditWindowVisible
  )
  return (
    <section className="container-toolbar">
      <ToggleButton
        value="edit"
        selected={isEditWindowVisible}
        onChange={() =>
          dispatch({
            type: "settings/setIsEditWindowVisible",
            payload: !isEditWindowVisible,
          })
        }
        className={`toggle-edit-btn ${isEditWindowVisible ? "active" : ""}`}
        size="small"
      >
        <EditIcon fontSize="small" />
      </ToggleButton>
    </section>
  )
}

export default ToolBar
