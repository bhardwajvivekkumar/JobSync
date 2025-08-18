import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";
import api from "../services/api";

interface User {
  name: string;
  email: string;
}

const quotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Opportunities don't happen, you create them.",
  "Dream big. Start small. Act now.",
  "Don't watch the clock; do what it does. Keep going.",
  "Your career is your responsibility, not your employer’s.",
  "The future depends on what you do today.",
  "Push yourself, because no one else is going to do it for you.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Fall seven times and stand up eight.",
  "Great things never come from comfort zones.",
  "Discipline is the bridge between goals and accomplishment.",
  "Do something today that your future self will thank you for.",
  "Success doesn’t just find you. You have to go out and get it.",
  "Big journeys begin with small steps.",
  "Perseverance is not a long race; it is many short races one after another.",
  "Your limitation—it’s only your imagination.",
  "Work hard in silence, let success make the noise.",
  "It always seems impossible until it’s done.",
  "Don’t stop until you’re proud.",
  "Little by little, a little becomes a lot.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "Believe you can and you’re halfway there.",
  "Winners are not afraid of losing. But losers are.",
  "Act as if what you do makes a difference. It does.",
  "Small progress is still progress.",
];

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [openLogout, setOpenLogout] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [quote, setQuote] = useState<string>("");

  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await api.get("/users/me");

        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(res.data);
        }

        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      } catch (err) {
        console.error("Error fetching user:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setSnackbarMsg("You are successfully logged out.");
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/delete");
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      setSnackbarMsg("Your account has been deleted.");
      window.location.href = "/signup";
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleExport = async (type: "csv" | "pdf") => {
    try {
      setExportError(null);
      setExportMessage(null);

      const res = await api.get(`/jobs/export/${type}`, {
        responseType: "blob",
      });

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `job_history.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setExportMessage(`Jobs exported successfully as ${type.toUpperCase()}`);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setExportError(err.response.data.message);
      } else {
        setExportError("Something went wrong exporting jobs.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ color: "black" }}>
      <Paper
        sx={{
          p: 4,
          mt: 8,
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {isLoggedIn && user ? (
          <>
            <Typography variant="subtitle1">
              Logged in as: <strong>{user.name}</strong>
            </Typography>
            <Typography variant="subtitle2">{user.email}</Typography>

            <Divider sx={{ my: 2, backgroundColor: "black" }} />

            {quote && (
              <Paper
                sx={{
                  p: 2,
                  my: 2,
                  backgroundColor: "#f5f5f5",
                  borderLeft: "4px solid black",
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "{quote}"
                </Typography>
              </Paper>
            )}

            <Typography variant="subtitle1" gutterBottom>
              Export Job History
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleExport("csv")}
              sx={{ mr: 2, color: "black", borderColor: "black" }}
            >
              Export as CSV
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleExport("pdf")}
              sx={{ color: "black", borderColor: "black" }}
            >
              Export as PDF
            </Button>

            {exportError && (
              <Card sx={{ mt: 2, bgcolor: "#ffe5e5" }}>
                <CardContent>
                  <Typography color="error">{exportError}</Typography>
                </CardContent>
              </Card>
            )}
            {exportMessage && (
              <Card sx={{ mt: 2, bgcolor: "#e5ffe5" }}>
                <CardContent>
                  <Typography color="success.main">{exportMessage}</Typography>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ my: 2, backgroundColor: "black" }} />

            <Button
              onClick={() => setOpenLogout(true)}
              fullWidth
              sx={{ mt: 2, color: "black", border: "1px solid black" }}
            >
              Logout
            </Button>
            <Button
              onClick={() => setOpenDelete(true)}
              fullWidth
              sx={{
                mt: 2,
                color: "white",
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Delete Account
            </Button>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" color="error">
              You are not logged in.
            </Typography>
            <Button fullWidth href="/login" sx={{ mt: 1, color: "black" }}>
              Login
            </Button>
            <Button fullWidth href="/signup" sx={{ mt: 1, color: "black" }}>
              Signup
            </Button>
          </>
        )}
      </Paper>

      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleLogout();
              setOpenLogout(false);
            }}
            autoFocus
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is permanent. Are you sure you want to delete your
            account and all associated job history?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteAccount();
              setOpenDelete(false);
            }}
            color="error"
            autoFocus
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </Container>
  );
}
