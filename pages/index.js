import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import Sidebar from "../components/Sidebar"; // Adjust the import path as necessary
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import useMediaQuery from '@mui/material/useMediaQuery';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [query, setQuery] = useState("");

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "prompt", headerName: "Prompt", width: 350 },
    { field: "updated_on", headerName: "Updated On", width: 200 },
  ];

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log("user", user);
    getData(page, size, query);
  }, [page, size, query]);

  const getData = async (page, size, query) => {
    setIsLoading(true);
    try {
      console.log("calling api");
      const res = await fetch(`/api/prompts/getAll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          page,
          size,
          query,
        }),
      });
      console.log("res", res);
      const data = await res.json();
      setPrompts(data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch prompts");
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? 10 : 0,
          transition: "margin 0.3s",
          padding: isMobile ? 1 : 3, // Adjust padding based on screen size
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              margin="normal"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value);
                getData(page, size, e.target.value);
              }}
              InputProps={{
                style: {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  width: isMobile ? "100%" : "300px", // Full width on mobile
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px", // Control the height of the text field
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "4px", // Optionally adjust border radius
                  },
                },
              }}
            />
            <Button
              variant="contained"
              component={Link}
              href="/create"
              sx={{
                height: "50px", // Control the height of the button
                width: isMobile ? "100%" : "200px", // Full width on mobile
                textTransform: "none",
                mt: isMobile ? 2 : 0, // Margin top on mobile
              }}
            >
              New Prompt
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ height: "70vh", width: "100%" }}>
            <DataGrid
              rows={prompts}
              columns={columns}
              loading={isLoading}
              sx={{ cursor: "pointer" }}
              pageSizeOptions={[10, 20, 50]}
              onCellClick={(params) => {

                if (params.field === "name") {
                  window.location.href = `/prompt/${params.id}`;
                }
              }}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default HomePage;
