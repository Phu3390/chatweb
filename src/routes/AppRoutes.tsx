import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignupPage"
import ProtectedRoute from "./ProtectedRoute"
import ChatPage from "../pages/chat/ChatPage"
import GuestRoute from "./GuestRoute"



export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />

        <Route path="/login" element={
          <GuestRoute>
          <LoginPage />
          </GuestRoute>} />
        <Route path="/signup" element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        

        <Route path="*" element={<div>404 NOT FOUND</div>} />
      </Routes>
    </BrowserRouter>
  )
}