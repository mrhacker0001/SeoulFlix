import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    // Menu ichidagi linklar (mobile drawer)
    const drawerLinks = [
        { text: "Bosh sahifa", to: "/" },
        { text: "Yordam", to: "/help" },
        { text: "Murojaat", to: "/require" },
        ...(user
            ? [] // Profil va Search alohida, Drawerda emas
            : [
                { text: "Kirish", to: "/signin" },
                { text: "Ro‘yxatdan o‘tish", to: "/signup" },
            ]),
    ];

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: "#121212" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <video
                            src="/seoulflix-animation.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: "120px", height: "auto", borderRadius: "8px" }}
                        />
                    </Box>

                    {/* Desktop menu */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                        <Button color="inherit" component={Link} to="/">
                            Bosh sahifa
                        </Button>
                        <IconButton color="inherit" component={Link} to="/search">
                            <SearchIcon />
                        </IconButton>
                        <Button color="inherit" component={Link} to="/help">
                            Yordam
                        </Button>
                        <Button color="inherit" component={Link} to="/require">
                            Murojaat
                        </Button>
                        {user ? (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/profile"
                                startIcon={<Avatar src={user.photoURL} sx={{ width: 30, height: 30 }} />}
                            >

                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/signin"
                                    sx={{
                                        textTransform: "none",
                                        borderColor: "rgba(255,255,255,0.6)",
                                        color: "#fff",
                                        borderRadius: 2,
                                        px: 2,
                                        '&:hover': {
                                            borderColor: "#fff",
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                        },
                                    }}
                                >
                                    Kirish
                                </Button>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/signup"
                                    sx={{
                                        textTransform: "none",
                                        bgcolor: "#e50914",
                                        color: "#fff",
                                        borderRadius: 2,
                                        px: 2,
                                        boxShadow: "none",
                                        '&:hover': { bgcolor: "#b20710", boxShadow: "none" },
                                    }}
                                >
                                    Ro‘yxatdan o‘tish
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Mobile menu */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
                        {/* Search icon har doim ko‘rinadi */}
                        <IconButton color="inherit" component={Link} to="/search">
                            <SearchIcon />
                        </IconButton>

                        {/* Profil avatar */}
                        {user && (
                            <Avatar
                                src={user.photoURL}
                                sx={{ width: 30, height: 30 }}
                                component={Link}
                                to="/profile"
                            />
                        )}

                        {/* Menu icon */}
                        <IconButton color="inherit" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for mobile */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {drawerLinks.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton component={Link} to={item.to}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
