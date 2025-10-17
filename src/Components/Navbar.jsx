import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <AppBar position="sticky" sx={{ bgcolor: "#121212" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#e50914" }}>
                    SeoulFlix
                </Typography>

                <Box>
                    <Button color="inherit" component={Link} to="/">Bosh sahifa</Button>
                    <Button color="inherit" component={Link} to="/search">Qidirish</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
