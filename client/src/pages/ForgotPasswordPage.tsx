import { useState } from "react";
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
import { requestPasswordReset } from "../services/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!emailRegex.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email);
      setOk("If the email exists, a reset link was sent.");
      setEmail("");
    } catch (error) {
      setErr("Something went wrong. Please try again.");
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
            Forgot Password
          </Typography>
          <Typography color="black" sx={{ mb: 3 }}>
            Enter your email and we'll send you a reset link.
          </Typography>

          <form onSubmit={submit} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
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
