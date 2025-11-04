// src/App.jsx
import React from "react"
import { Box } from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"

export default function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Box>
  )
}
