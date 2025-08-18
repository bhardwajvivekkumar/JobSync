import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordWithToken } from "../services/auth";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!token) {
      setErr("Invalid or missing token.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithToken(token, password);
      setOk("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, border: "1px solid black", bgcolor: "white" }}>
          <Typography variant="h4" fontWeight={700} color="black" gutterBottom>
            Set New Password
          </Typography>
          <Typography color="black" sx={{ mb: 3 }}>
            Enter a new password for your account.
          </Typography>

          <form onSubmit={submit} noValidate>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{ sx: { color: "black" } }}
              InputLabelProps={{ sx: { color: "black" } }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{ sx: { color: "black" } }}
              InputLabelProps={{ sx: { color: "black" } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "black",
                color: "white",
                border: "1px solid black",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <Box mt={2} textAlign="center">
            <Link href="/login" underline="hover" color="black">
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={!!err}
        autoHideDuration={4000}
        onClose={() => setErr(null)}
      >
        <Alert severity="error" onClose={() => setErr(null)}>
          {err}
        </Alert>
      </Snackbar>

      <Snackbar open={!!ok} autoHideDuration={4000} onClose={() => setOk(null)}>
        <Alert severity="success" onClose={() => setOk(null)}>
          {ok}
        </Alert>
      </Snackbar>
    </Box>
  );
}
