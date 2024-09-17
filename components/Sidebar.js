import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Article, Dashboard, Logout, Settings } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

export default function ResponsiveDrawer({ canMove, handleLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };
  const presentRoute = router.pathname;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (event) => {
    handleMenuClick(event);
    setOpen(!open);
  };

  const openPrompt = () => {
    if (presentRoute === "/") {
      canMove = true;
      router.push("/");
    } else if (canMove) {
      router.push("/");
      canMove = true;
    } else if (confirm("Do you want to leave this page?")) {
      router.push("/");
      canMove = true;
    }
  };

  const logOut = () => {
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <DrawerHeader>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          onClick={openPrompt}
          sx={{ cursor: "pointer" }}
        >
          <img src="./prompthub.jpg" alt="Logo" style={{ height: "40px" }} />
          <Typography variant="h5" gutterBottom>
            Prompt Hub
          </Typography>
        </Stack>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem key="Prompts" disablePadding onClick={openPrompt}>
          <ListItemButton>
            <ListItemIcon>
              <Article />
            </ListItemIcon>
            <ListItemText primary="Prompts" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <List>
          <ListItem key="Settings" disablePadding href="">
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <Avatar>{String(user.name[0]).toLocaleUpperCase()}</Avatar>
              </ListItemIcon>
              <ListItemText primary={String(user.name)} />
            </ListItemButton>
          </ListItem>
          <Collapse
            in={open}
            orientation="vertical"
            timeout="auto"
            unmountOnExit
          >
            <List
              component="div"
              disablePadding
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <ListItemButton sx={{ pl: 4 }} onClick={logOut}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ ml: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth },
          display: { xs: 'block', sm: 'block' }, // Hide drawer on larger screens if you want
        }}
      >
        {drawer}
      </Drawer>
      {/* Add content here if needed */}
    </Box>
  );
}
