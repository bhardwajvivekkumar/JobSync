import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Popper,
  Grow,
  ClickAwayListener,
  Badge,
  Menu,
  MenuItem,
  Checkbox,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useState, useRef, useEffect } from "react";

// Interface
interface FollowUp {
  _id: string;
  company: string;
  followUpReminder: string;
  followUpDone?: boolean;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dueFollowUps, setDueFollowUps] = useState<FollowUp[]>([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Add Application", path: "/add" },
    { label: "My Applications", path: "/applications" },
    { label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    const fetchDueFollowUps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/applications/followups/due", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch follow-ups");
        const data = await res.json();
        setDueFollowUps(data);
      } catch (err) {
        console.error("Failed to fetch follow-ups", err);
      }
    };

    fetchDueFollowUps();
  }, []);

  const handleToggle = () => setMenuOpen((prev) => !prev);
  const handleClose = () => setMenuOpen(false);
  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) =>
    setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const notifOpen = Boolean(notifAnchorEl);

  const toggleFollowUpStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}/followup-toggle`, {
        method: "PUT",
      });
      if (res.ok) {
        setDueFollowUps((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to toggle follow-up");
      }
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", paddingX: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={Logo}
              alt="JobSync Logo"
              style={{ width: 36, height: 36, marginRight: 10 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              JobSync
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{ color: "#fff", fontWeight: 500 }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* 🔔 Notification Bell */}
            <IconButton color="inherit" onClick={handleNotifClick}>
              <Badge
                variant={dueFollowUps.length > 0 ? "dot" : undefined}
                color="default"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notifAnchorEl}
              open={notifOpen}
              onClose={handleNotifClose}
            >
              {dueFollowUps.length === 0 ? (
                <MenuItem>No follow-ups due</MenuItem>
              ) : (
                dueFollowUps.map((app) => (
                  <MenuItem
                    key={app._id}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Checkbox
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollowUpStatus(app._id);
                      }}
                    />
                    <Box
                      onClick={() => {
                        navigate(`/applications/${app._id}`);
                        handleNotifClose();
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      Follow-up: {app.company}
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* 🍔 Mobile Menu */}
            {isMobile && (
              <Box>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleToggle}
                  ref={anchorRef}
                >
                  <MenuIcon />
                </IconButton>
                <Popper
                  open={menuOpen}
                  anchorEl={anchorRef.current}
                  placement="bottom-end"
                  transition
                  disablePortal
                  modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
                >
                  {({ TransitionProps }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: "top right" }}
                    >
                      <Paper
                        sx={{
                          mt: 1.5,
                          width: 200,
                          borderRadius: 2,
                          backgroundColor: "#1e1e1e",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <ClickAwayListener onClickAway={handleClose}>
                          <List>
                            {navItems.map((item) => (
                              <ListItem disablePadding key={item.path}>
                                <ListItemButton
                                  component={RouterLink}
                                  to={item.path}
                                  onClick={handleClose}
                                  sx={{
                                    color: "#fff",
                                    paddingY: 1,
                                    paddingX: 2,
                                    transition: "background-color 0.3s",
                                    "&:hover": {
                                      backgroundColor: "#333",
                                    },
                                  }}
                                >
                                  <ListItemText primary={item.label} />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
