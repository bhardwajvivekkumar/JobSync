import { useState } from "react";
import { signupUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const capitalized =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      const data = await signupUser({
        name: capitalized,
        email,
        password,
      });
      localStorage.setItem("token", data.token || "");
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 3,
            bgcolor: "white",
            border: "1px solid black",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
          >
            Want to sort your job hunting at one place? Please Signup
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: { color: "black" },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: { color: "black" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: { color: "black" },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 4,
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "#333" },
                py: 1.2,
                fontSize: "1rem",
              }}
            >
              Sign Up
            </Button>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 4, textAlign: "center", color: "black" }}
          >
            Already signed up?{" "}
            <Link to="/login" style={{ color: "black", fontWeight: "bold" }}>
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* Error Popup */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Signup successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
}
