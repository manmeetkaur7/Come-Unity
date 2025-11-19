// src/App.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/pages/Auth";
import EventsPage from "@/pages/Events/EventsPage";
import CreateEventPage from "@/pages/Events/CreateEventPage";
import EventDetails from "@/pages/Events/EventDetails";
import SavedEventsPage from "@/pages/Events/SavedEventsPage";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import VolunteerDashboard from "@/pages/Volunteer/VolunteerDashboard";
import OrganizerDashboard from "@/pages/Organizer/OrganizerDashboard";

const readUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.user || null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const user = readUserFromStorage();
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  const [user, setUser] = React.useState(readUserFromStorage());

  // Re-sync user when LoginPage triggers window.storage event
  React.useEffect(() => {
    const syncUser = () => setUser(readUserFromStorage());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

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

        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEventPage user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/saved"
          element={
            <ProtectedRoute>
              <SavedEventsPage user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute>
              <OrganizerDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}
