import { useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,Stack,
  Link as MuiLink,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(""); // State to handle name validation error
  const [emailError, setEmailError] = useState(""); // State to handle email validation error
  const [passwordError, setPasswordError] = useState(""); // State to handle password validation error
  const [open, setOpen] = useState(false); // State to control Snackbar visibility
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (name.length <= 2) {
      setNameError("Name must be more than 2 characters");
      return;
    }

    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setEmailError("Invalid email address");
      return;
    }

    // Password validation
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[@$!%*?&]/;

    let passwordError = "";

    if (!lowercaseRegex.test(password)) {
      passwordError += "Password must have at least one lowercase letter. ";
    }
    if (!uppercaseRegex.test(password)) {
      passwordError += "Password must have at least one uppercase letter. ";
    }
    if (!numberRegex.test(password)) {
      passwordError += "Password must have at least one number. ";
    }
    if (!specialCharRegex.test(password)) {
      passwordError += "Password must have at least one special character. ";
    }
    if (password.length < 6) {
      passwordError += "Password must be at least 6 characters long. ";
    }

    if (passwordError) {
      setPasswordError(passwordError.trim());
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        // Show success message
        setOpen(true);
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        throw new Error("Failed to sign up");
      }
    } catch (err) {
      setError("Error signing up");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
    <Container maxWidth="xs">
    <Stack  alignItems="center" spacing={2}>
          <img src="./prompthub.jpg" alt="Logo" style={{ height: "100px",width:"100px" }} />{" "}
          </Stack>
          <Box mt={2}></Box>
      <Typography variant="h4" align="center"  gutterBottom>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate mt={2} align="center">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => {
            var name = e.target.value.replace("  ", " ");
            setName(name);
            if (name.length < 2) {
              setNameError("Name must be at least 2 characters long");
            } else {
              setNameError("");
            }
          }}
          InputProps={{
            style: {
              backgroundColor: "#2a2a2a",
              color: "#fff",
              padding: "1px 1px",
            },
          }}
          required
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            var email = e.target.value.replace(" ", "");
            email.toLowerCase();
            setEmail(email);
            if (name.length == 0) {
              setNameError("Name must be at least 2 characters long");
            }
            // Validate email
            if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
              setEmailError("Invalid email address");
            } else {
              setEmailError("");
            }
          }}
          InputProps={{
            style: {
              backgroundColor: "#2a2a2a",
              color: "#fff",
              padding: "1px 1px",
            },
          }}
          required
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value.length <= 6) {
              setPasswordError("Password must be at least 6 characters long");
            }
            else {
              setPasswordError("");
            }
          }}
          InputProps={{
            style: {
              backgroundColor: "#2a2a2a",
              color: "#fff",
              padding: "1px 1px",
            },
          }}
          required
          error={!!passwordError}
          helperText={passwordError}
        />
        <Box mt={2}></Box>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Sign Up
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="body2">
          Already have an account?{" "}
          <MuiLink href="/signin" underline="hover">
            Sign In
          </MuiLink>
        </Typography>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Sign up successful!
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
}

export default SignUpPage;
