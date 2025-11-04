// src/App.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/pages/Auth";
import EventsPage from "@/pages/Events/EventsPage";

const useAuthUser = () => {
  const raw = localStorage.getItem("user"); // e.g. {"role":"volunteer"}
  return raw ? JSON.parse(raw) : null;
};

const ProtectedRoute = ({ children }) =>
  useAuthUser() ? children : <Navigate to="/" replace />;

export default function App() {
  const user = useAuthUser() || { role: "volunteer" }; // fallback for dev
  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}
