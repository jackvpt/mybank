// 🧭 Router
import Router from "./router/Router"

// 🧩 Components
import AppInitializer from "./AppInitializer"

const App = () => {
  return (
    <AppInitializer>
      <Router />
    </AppInitializer>
  )
}

export default App
