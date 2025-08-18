import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import JobApplicationForm from "./components/JobApplicationForm";
import Dashboard from "./pages/Dashboard";
import ApplicationList from "./pages/ApplicationList";
import Settings from "./pages/Settings";
import { Box } from "@mui/material";
import ApplicationDetails from "./pages/ApplicationDetails";
import BlogDetail from "./components/BlogDetail";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/add" element={<JobApplicationForm />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
