// pages/forgot-password.js
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Link as MuiLink,
} from "@mui/material";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Implement password reset logic here
      if (!email || !oldPassword || !newPassword) {
        return setError("Email, old password and new password are required.");
      }

      // email foramt
      if (!/\S+@\S+\.\S+/.test(email)) {
        return setError("Invalid email format");
      }

      if (oldPassword === newPassword) {
        return setError("Old password and new password cannot be the same.");
      }

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      response
        .json()
        .then((data) => {
          console.log(data);
          setMessage(data.message);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });

      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => (window.location.href = "/"), 200); // Redirect to home after success
      }
    } catch (err) {
      setError("Error sending password reset link.");
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
        <Box>
          <Stack alignItems="center" spacing={2}>
            <img
              src="./prompthub.jpg"
              alt="Logo"
              style={{ height: "100px", width: "100px" }}
            />{" "}
          </Stack>
          <Box mt={2}></Box>
          <Typography variant="h4" align="center" gutterBottom>
            Rest Password
          </Typography>
          <form onSubmit={handleSubmit} noValidate mt={2} align="center">
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
              label="Old Password"
              variant="outlined"
              fullWidth
              type="password"
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Rest Password
            </Button>
          </form>
          <Box mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <a href="/signin" style={{ textDecoration: "none" }}>
                Sign In
              </a>
            </Typography>
            
          </Box>
          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPasswordPage;
