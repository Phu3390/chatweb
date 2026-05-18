import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignupPage"
import ProtectedRoute from "./ProtectedRoute"



export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* <Route path="/chat" element={<ChatPage />} /> */}
        {/* <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        /> */}
        

        <Route path="*" element={<div>404 NOT FOUND</div>} />
      </Routes>
    </BrowserRouter>
  )
}