import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Switch,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import api from "../services/api";

interface User {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // ✅ Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // Make sure backend has this route
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await api.put("/users/settings", { notifications, password });
      alert("Settings updated!");
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await api.delete("/users/delete");
        localStorage.removeItem("token");
        window.location.href = "/signup";
      } catch (err) {
        console.error("Error deleting account:", err);
      }
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Container maxWidth="sm" sx={{ color: "black" }}>
      <Paper
        sx={{
          p: 4,
          mt: 8,
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>

        {user && (
          <>
            <Typography variant="subtitle1">
              Logged in as: <strong>{user.name}</strong>
            </Typography>
            <Typography variant="subtitle2">{user.email}</Typography>
          </>
        )}

        <Divider sx={{ my: 2, backgroundColor: "black" }} />

        <Typography variant="subtitle1">Enable Notifications</Typography>
        <Switch
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />

        <Divider sx={{ my: 2, backgroundColor: "black" }} />

        <Typography variant="subtitle1">Change Password</Typography>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Divider sx={{ my: 2, backgroundColor: "black" }} />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Save Settings
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            color: "black",
            borderColor: "black",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>

        <Divider sx={{ my: 2, backgroundColor: "black" }} />

        {!isLoggedIn && (
          <>
            <Button fullWidth href="/login" sx={{ mt: 1, color: "black" }}>
              Login
            </Button>
            <Button fullWidth href="/signup" sx={{ mt: 1, color: "black" }}>
              Signup
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
