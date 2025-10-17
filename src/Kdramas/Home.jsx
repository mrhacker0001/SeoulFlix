import React from "react";
import { Container, Typography } from "@mui/material";
import DramaList from "./DramaList";



export default function HomePage() {


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                🎥 Mashhur Dramalar
            </Typography>
            <DramaList />
        </Container>
    );
}
