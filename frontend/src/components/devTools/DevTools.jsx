import { useSelector } from "react-redux"

const DevTools = () => {
  const data = useSelector(
    (state) => state.settings.transactionsTableScrollPosition
  )

  return <div>{data}</div>
}

export default DevTools
