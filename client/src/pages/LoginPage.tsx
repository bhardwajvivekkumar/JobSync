import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { loginUser } from "../services/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const emailError = email.length > 0 && !emailRegex.test(email);
  const passwordError = password.length > 0 && password.length < 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token || "");
      setOkMsg("Welcome back! Logging you in...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: "1px solid black",
            bgcolor: "white",
          }}
        >
          <Typography variant="h4" fontWeight={700} color="black" gutterBottom>
            Welcome back
          </Typography>
          <Typography color="black" sx={{ mb: 3 }}>
            Log in to keep your job hunt organized.
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? "Enter a valid email." : " "}
              sx={{ mb: 1 }}
              InputProps={{ sx: { color: "black" } }}
              InputLabelProps={{ sx: { color: "black" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Min 6 characters." : " "}
              sx={{ mb: 1 }}
              InputProps={{ sx: { color: "black" } }}
              InputLabelProps={{ sx: { color: "black" } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                bgcolor: "black",
                color: "white",
                border: "1px solid black",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Link href="/forgot-password" underline="hover" color="black">
              Forgot password?
            </Link>
            <Typography color="black">
              New here?{" "}
              <Link href="/signup" underline="hover" color="black">
                Create an account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Error / Success snackbars */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg(null)}
      >
        <Alert severity="error" onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!okMsg}
        autoHideDuration={2000}
        onClose={() => setOkMsg(null)}
      >
        <Alert severity="success" onClose={() => setOkMsg(null)}>
          {okMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
