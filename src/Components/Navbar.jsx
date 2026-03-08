import React, { useEffect, useState, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Avatar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Divider 
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from '@mui/icons-material/Language';
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";
import { useDispatch } from "react-redux";
import { setLang } from "../Redux/lang";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const navLinkStyle = (path) => ({
        color: location.pathname === path ? "#e50914" : "#fff",
        fontWeight: "bold",
        textTransform: "none",
        fontSize: "0.95rem",
        transition: "0.3s",
        "&:hover": {
            color: "#e50914",
            backgroundColor: "transparent"
        }
    });

    const drawerLinks = [
        { text: langData.home, to: "/" },
        { text: langData.help, to: "/help" },
        { text: langData.adress, to: "/require" },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: "rgba(11, 11, 11, 0.8)",
                    backdropFilter: "blur(15px)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "none"
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            transition: "0.3s",
                            "&:hover": { opacity: 0.8 }
                        }}
                    >
                        <video
                            src="/seoulflix-animation.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: "130px", height: "auto", filter: "drop-shadow(0 0 5px rgba(229, 9, 20, 0.3))" }}
                        />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
                        <Button component={Link} to="/" sx={navLinkStyle("/")}>
                            {langData.home}
                        </Button>
                        <Button component={Link} to="/help" sx={navLinkStyle("/help")}>
                            {langData.help}
                        </Button>
                        <Button component={Link} to="/require" sx={navLinkStyle("/require")}>
                            {langData.adress}
                        </Button>

                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 1 }} />

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Tooltip title="Qidiruv">
                                <IconButton component={Link} to="/search" sx={{ color: "#fff", "&:hover": { color: "#e50914" } }}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>

                            <Select
                                size="small"
                                value={states.lang}
                                onChange={(e) => dispatch(setLang(e.target.value))}
                                IconComponent={LanguageIcon}
                                sx={{
                                    color: "white",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    ".MuiOutlinedInput-notchedOutline": { border: "none" },
                                    ".MuiSelect-icon": { color: "#e50914", fontSize: "1.2rem", left: -5 },
                                    ".MuiSelect-select": { pl: 3 }
                                }}
                            >
                                <MenuItem value="uz">UZ</MenuItem>
                                <MenuItem value="en">EN</MenuItem>
                            </Select>
                        </Stack>

                        {user ? (
                            <IconButton component={Link} to="/profile" sx={{ p: 0.5, border: "2px solid #e50914" }}>
                                <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
                            </IconButton>
                        ) : (
                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    component={Link}
                                    to="/signin"
                                    sx={{ color: "#fff", textTransform: "none", fontWeight: "bold", "&:hover": { color: "#e50914" } }}
                                >
                                    {langData.login}
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/signup"
                                    sx={{
                                        textTransform: "none",
                                        bgcolor: "#e50914",
                                        fontWeight: "bold",
                                        borderRadius: "8px",
                                        px: 3,
                                        boxShadow: "0 4px 14px rgba(229, 9, 20, 0.4)",
                                        "&:hover": { bgcolor: "#b20710", boxShadow: "0 6px 20px rgba(229, 9, 20, 0.6)" },
                                    }}
                                >
                                    {langData.register}
                                </Button>
                            </Stack>
                        )}
                    </Box>

                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 0.5 }}>
                        <IconButton component={Link} to="/search" sx={{ color: "#fff" }}>
                            <SearchIcon />
                        </IconButton>
                        {user && (
                            <Avatar
                                src={user.photoURL}
                                sx={{ width: 30, height: 30, border: "1px solid #e50914", mx: 1 }}
                                component={Link}
                                to="/profile"
                            />
                        )}
                        <IconButton sx={{ color: "#fff" }} onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        bgcolor: "#0b0b0b",
                        color: "#fff",
                        borderLeft: "1px solid rgba(229, 9, 20, 0.2)"
                    }
                }}
            >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <video
                        src="/seoulflix-animation.mp4"
                        autoPlay loop muted playsInline
                        style={{ width: "100px", marginBottom: "20px" }}
                    />
                    <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
                    <List>
                        {drawerLinks.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.to}
                                    onClick={toggleDrawer(false)}
                                    sx={{
                                        borderRadius: "10px",
                                        mb: 1,
                                        "&:hover": { bgcolor: "rgba(229, 9, 20, 0.1)", color: "#e50914" }
                                    }}
                                >
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: "bold" }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}