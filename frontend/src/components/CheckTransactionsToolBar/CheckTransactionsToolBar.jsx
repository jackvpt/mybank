// 🎨 Styles
import "./CheckTransactionsToolBar.scss"

// ⚛️ React
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

// 🏪 Redux
import { setIsCheckTransactionsEditWindowVisible } from "../../store/features/parametersSlice"

// 🧩 Components
import CustomToggleButton from "../SubComponents/CustomToggleButton/CustomToggleButton"
import SmartCheck from "../SmartCheck/SmartCheck"

const CheckTransactionsToolBar = () => {
  const dispatch = useDispatch()

  const [isSmartCheckOpen, setIsSmartCheckOpen] = useState(false)

  const isCheckTransactionsEditWindowVisible = useSelector(
    (state) => state.parameters.isCheckTransactionsEditWindowVisible,
  )

  return (
    <section className="container__checkTransactions--toolbar">
      {/** Magic button */}
      <CustomToggleButton
        iconStyle="magic"
        ariaLabel="Magic button"
        onClick={() => setIsSmartCheckOpen(true)}
      />

      {/** Edit button */}
      <CustomToggleButton
        selected={isCheckTransactionsEditWindowVisible}
        onChange={() =>
          dispatch(
            setIsCheckTransactionsEditWindowVisible(
              !isCheckTransactionsEditWindowVisible,
            ),
          )
        }
        iconStyle="edit"
      />

      {/** Smart modal */}
      <SmartCheck
        open={isSmartCheckOpen}
        onClose={() => setIsSmartCheckOpen(false)}
      />
    </section>
  )
}

export default CheckTransactionsToolBar
