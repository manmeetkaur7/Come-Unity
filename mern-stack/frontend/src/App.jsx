// src/App.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
    const parsed = JSON.parse(raw); // { token, user }
    return parsed.user || null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = readUserFromStorage();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/events" replace />;
    }
  }

  return children;
};

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(readUserFromStorage());

  // Sync user when login/signup/logout fires "storage" event
  React.useEffect(() => {
    const syncUser = () => setUser(readUserFromStorage());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = React.useCallback(() => {
    // Clear auth
    localStorage.removeItem("user");
    // Notify listeners (App + any other tabs) to re-read auth state
    window.dispatchEvent(new Event("storage"));
    // Route back to sign-in
    navigate("/");
  }, [navigate]);

  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateEventPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/saved"
          element={
            <ProtectedRoute>
              <SavedEventsPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute>
              <OrganizerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}
