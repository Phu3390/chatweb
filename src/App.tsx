import './App.css'
import AppRouter from './routes/AppRoutes'
import { Toaster } from "react-hot-toast"

function App() {
   return  <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
}

export default App
