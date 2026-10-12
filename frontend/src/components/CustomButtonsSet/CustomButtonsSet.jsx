// 🎨 Styles
import "./CustomButtonsSet.scss"

// 🧩 Components
import CustomButton from "../SubComponents/CustomButton/CustomButton"


const CustomButtonsSet = ({ buttons }) => {
  return (
    <div className="container__customButtonsSet">
    {buttons.map(({ action, ...props }) => (
      <CustomButton
        key={action}
        action={action}
        {...props}
      />
    ))}
    </div>
  )
}

export default CustomButtonsSet