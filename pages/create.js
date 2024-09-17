import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Sidebar from "../components/Sidebar";

export default function CreatePrompt() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editAccess, setEditAccess] = useState([]); // Default access to true for now
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const logginUser = JSON.parse(localStorage.getItem("user")) || null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const handleSubmit = async (e) => {
    console.log(logginUser);
    e.preventDefault();
    if (name === "" || prompt === "") {
      setErrorMessage("Please fill in all fields");
      return;
    }
    var edit_values = [];
    if (editAccess.length > 0) {
      edit_values = editAccess.map((user) => user.id);
    }

    edit_values.push(logginUser.id);

    const res = await fetch("/api/prompts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        prompt,
        updated_by: logginUser.id, // In real case, retrieve user ID
        edit_access: edit_values,
      }),
    });
    if (res.status > 200 && res.status < 300) {
      router.push("/");
    } else {
      alert("Failed to create prompt");
    }
  };

  const getUser = (query) => {
    const response = fetch(`/api/user/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        res.json().then((data) => {
          setUsers(data);
          console.log(data);
        });
      } else {
        setErrorMessage("Failed to fetch users");
      }
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        canMove={name == "" && prompt == ""}
        handleLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Box
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? 10 : 0,
          transition: "margin 0.3s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="Ml">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: "#1e1e1e",
              padding: 4,
              borderRadius: 2,
              boxShadow: 5,
            }}
          >
            <Typography variant="h5">Create New Prompt</Typography>
            <Box sx={{ mt: 2 }} />
            <Typography variant="body2">Prompt Name</Typography>
            <TextField
              label=""
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: "#8e8e8e" } }}
              InputProps={{
                style: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  padding: "1px 1px",
                },
              }}
            />
            <Box sx={{ mt: 2 }} />

            <Typography variant="body2">Prompt</Typography>
            <Box xl={{ mt: 100 }}>
              <TextField
                label=""
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10} // Set the number of rows to increase the height
                InputLabelProps={{ style: { color: "#8e8e8e" } }}
                InputProps={{
                  style: {
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    height: "300px", // Adjust the height of the text box
                  },
                }}
              />
            </Box>
            {/* Edit Access with Tooltip */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography variant="body2">Edit Access</Typography>
              <Tooltip title="Add people who can have access to edit the prompt">
                <IconButton>
                  <InfoOutlined sx={{ color: "#fff" }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name || ""}
              value={Array.isArray(editAccess) ? editAccess : []}
              onChange={(event, newValue) => {
                setEditAccess(Array.isArray(newValue) ? newValue : []);
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length > 2) {
                  getUser(newInputValue);
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label=""
                  InputLabelProps={{ style: { color: "#8e8e8e" } }}
                  InputProps={{
                    style: { backgroundColor: "#2a2a2a", color: "#fff" },
                  }}
                />
              )}
            />

            {/* error */}
            {errorMessage && (
              <Box sx={{ mt: 2 }}>
                <p style={{ color: "red" }}>{errorMessage}</p>
              </Box>
            )}
            <Stack direction="row" spacing={2} sx={{ mt: 2, width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Create
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
