import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Box, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AppBar position="sticky" sx={{ bgcolor: "#121212" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <video
                        src="/seoulflix-animation.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: "120px", height: "auto", borderRadius: "8px" }}
                    />
                </Box>
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Bosh sahifa
                    </Button>
                    <Button color="inherit" component={Link} to="/search">
                        Qidirish
                    </Button>
                    <Button color="inherit" component={Link} to="/help">
                        Yordam
                    </Button>
                </Box>

                <Box>

                    {user ? (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/profile"
                            startIcon={
                                <Avatar
                                    src={user.photoURL}
                                    sx={{ width: 30, height: 30 }}
                                />
                            }
                        >
                            Profil
                        </Button>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/signin">
                                Kirish
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Ro‘yxatdan o‘tish
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
