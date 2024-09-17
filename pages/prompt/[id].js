import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import {
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";

import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

export default function EditPrompt() {
  const router = useRouter();
  const { id } = router.query; // Get the prompt ID from the URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [canMove, setCanMove] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editAccess, setEditAccess] = useState([]); // Default access to true for now

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const getUser = (query) => {
    const users = fetch(`/api/user/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());
    return users
      .then((res) => res)
      .catch((err) => {
        console.error("Error searching users:", err);
        setUserSearchError("Could not search users");
      });
  };

  useEffect(() => {
    if (!id) return; // Prevent running if ID is undefined

    const fetchPrompt = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/prompts/${id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setName(data.name);
        setPrompt(data.prompt);

        const editAccess = data.userMeta;
        setEditAccess(editAccess);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    if (window.confirm("Are you sure you want to update this prompt?")) {
      try {
        const response = await fetch(`/api/prompts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, prompt }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Navigate back to the home page after successful update
        router.push("/");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const deletePrompt = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Navigate back to the home page after successful update
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            onSubmit={handleUpdate}
            sx={{
              backgroundColor: "#1e1e1e",
              padding: 4,
              borderRadius: 2,
              boxShadow: 5,
            }}
          >
            <Typography variant="h5">Update Prompt</Typography>
            <Box sx={{ mt: 2 }} />
            <Typography variant="body2">Prompt Name</Typography>
            <TextField
              label=""
              variant="outlined"
              fullWidth
              value={name}
              margin="normal"
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
              freeSolo
              options={users}
              getOptionLabel={(option) => option.name || ""} // Ensure the label is just the name
              value={Array.isArray(editAccess) ? editAccess : []} // Ensure value is an array
              onChange={(event, newValue) => {
                setEditAccess(Array.isArray(newValue) ? newValue : []); // Update only with an array
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length > 1) {
                  var data = getUser(newInputValue);
                  data
                    .then((res) => {
                      setUsers(res); // Set the list of users fetched from the API
                    })
                    .catch((err) => {
                      console.error("Error searching users:", err);
                      throw new Error("Could not search users");
                    });
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name} // Display the name as a tag
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
            {error && (
              <Box sx={{ mt: 2 }}>
                <p style={{ color: "red" }}>{error}</p>
              </Box>
            )}
            <Stack direction="row" spacing={2} sx={{ mt: 2, width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
