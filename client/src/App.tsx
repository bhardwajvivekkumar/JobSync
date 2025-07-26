import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import JobApplicationForm from "./components/JobApplicationForm";
import Dashboard from "./pages/Dashboard";
import ApplicationList from "./pages/ApplicationList";
import Settings from "./pages/Settings";
import { Box } from "@mui/material";
import ApplicationDetails from "./pages/ApplicationDetails";

function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<JobApplicationForm />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;