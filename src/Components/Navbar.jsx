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
    Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from '@mui/icons-material/Language';
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";
import { useDispatch } from "react-redux";
import { setLang } from "../Redux/lang";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MovieIcon from "@mui/icons-material/Movie";
import { Badge } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";


export default function Navbar() {
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    const dispatch = useDispatch();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
            const unread = snapshot.docs.filter(doc => !doc.data().read).length;
            setUnreadCount(unread);
        });

        return () => unsubscribe();
    }, []);


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
        { text: langData.favourites, to: "/favourites" },
        { text: langData.donations, to: "/donations" },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: "rgba(11, 11, 11, 0.95)",
                    backdropFilter: "blur(15px)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "none",
                    zIndex: 1100
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>

                    {/* LOGO */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
                    >
                        <video
                            src="/seoulflix-animation.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: "130px" }}
                        />
                    </Box>

                    {/* DESKTOP */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
                        <Button component={Link} to="/" sx={navLinkStyle("/")}>{langData.home}</Button>
                        <Button component={Link} to="/help" sx={navLinkStyle("/help")}>{langData.help}</Button>
                        <Button component={Link} to="/require" sx={navLinkStyle("/require")}>{langData.adress}</Button>
                        <Button component={Link} to="/favourites" sx={navLinkStyle("/favourites")}>{langData.favourites}</Button>
                        <Button component={Link} to="/donations" sx={navLinkStyle("/donations")}>{langData.donations}</Button>

                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.1)", mx: 1 }} />

                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton component={Link} to="/search" sx={{ color: "#fff" }}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton component={Link} to="/notifications">
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Select
                                size="small"
                                value={states.lang}
                                onChange={(e) => dispatch(setLang(e.target.value))}
                                IconComponent={LanguageIcon}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": { border: "none" },
                                    ".MuiSelect-icon": { color: "#e50914" }
                                }}
                            >
                                <MenuItem value="uz">UZ</MenuItem>
                                <MenuItem value="en">EN</MenuItem>
                            </Select>
                        </Stack>

                        {user ? (
                            <IconButton component={Link} to="/profile">
                                <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
                            </IconButton>
                        ) : (
                            <Button component={Link} to="/signin" sx={{ color: "#fff" }}>
                                {langData.login}
                            </Button>
                        )}
                    </Box>

                    {/* MOBILE TOP */}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            component={Link}
                            to="/search"
                            sx={{ color: "#fff" }}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton component={Link} to="/notifications">
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* DRAWER */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, bgcolor: "#0b0b0b", height: "100%", color: "#fff" }}>
                    <List>
                        {drawerLinks.map((item, i) => (
                            <ListItem key={i} disablePadding>
                                <ListItemButton component={Link} to={item.to} onClick={toggleDrawer(false)}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* 🔥 MOBILE BOTTOM NAV */}
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(11,11,11,0.9)",
                    backdropFilter: "blur(10px)",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    justifyContent: "space-around",
                    py: 1,
                    zIndex: 1200
                }}
            >
                {[
                    { icon: <HomeIcon />, path: "/" },
                    { icon: <HelpOutlineIcon />, path: "/help" },
                    { icon: <MovieIcon />, path: "/require" },
                    { icon: <FavoriteIcon />, path: "/favourites" },
                    { icon: <VolunteerActivismIcon />, path: "/donations" },
                    { icon: <Avatar sx={{ width: 22, height: 22 }} src={user?.photoURL} />, path: "/profile" }
                ].map((item, i) => {
                    const active = location.pathname === item.path;

                    return (
                        <IconButton
                            key={i}
                            component={Link}
                            to={item.path}
                            sx={{
                                color: active ? "#e50914" : "#9CA3AF",
                                display: "flex",
                                flexDirection: "column",
                                transition: "0.2s",
                                transform: active ? "translateY(-3px) scale(1.1)" : "none"
                            }}
                        >
                            {item.icon}

                            {active && (
                                <Box
                                    sx={{
                                        width: 5,
                                        height: 5,
                                        bgcolor: "#e50914",
                                        borderRadius: "50%",
                                        mt: 0.5
                                    }}
                                />
                            )}
                        </IconButton>
                    );
                })}
            </Box>
        </>
    );
}