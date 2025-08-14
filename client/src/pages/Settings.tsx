import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Switch,
  Button,
  Divider,
  TextField,
} from "@mui/material";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");

  const handleSave = () => {
    console.log("Settings saved:", { darkMode, notifications, password });
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Dark Mode</Typography>
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Enable Notifications</Typography>
        <Switch
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">Change Password</Typography>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
        >
          Save Settings
        </Button>

        <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
          Delete Account
        </Button>

        <Divider sx={{ my: 2 }} />

        <Button fullWidth href="/login" sx={{ mt: 1 }}>
          Login
        </Button>
        <Button fullWidth href="/signup" sx={{ mt: 1 }}>
          Signup
        </Button>
      </Paper>
    </Container>
  );
}
