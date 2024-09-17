import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Link as MuiLink,
  Stack,
} from "@mui/material";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate email and password
    if (!email || !password) {
      return setError("Email and password are required");
    }

    // email foramt
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError("Invalid email format");
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign in");
      }

      console.log(response);

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user)); // Store user data
      setSuccess("Sign-in successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 2000); // Redirect to home after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="xs">
        <Box mt={5}>
          <Stack  alignItems="center" spacing={2}>
          <img src="./prompthub.jpg" alt="Logo" style={{ height: "100px",width:"100px" }} />{" "}
          </Stack>
          <Box mt={2}></Box>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={handleSignIn}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => {
                var email = e.target.value;
                email.toLowerCase();
                setEmail(email);
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </form>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <MuiLink href="/signup" underline="hover">
              Sign Up
            </MuiLink>
          </Typography>
          <Typography variant="body2" mt={1}>
            Forgot your password?{" "}
            <MuiLink href="/forgot_password" underline="hover">
              Reset it here
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
