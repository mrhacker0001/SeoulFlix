import React from "react";
import { Container, Typography } from "@mui/material";
import DramaList from "./DramaList";
import HeroBanner from "../Components/HeroBanner";
import banner from "./banner.jpg";

export default function HomePage() {
    const banners = [
        {
            imageUrl: banner,
            title: "BU YERDA TELEGRAM KANALIMIZ MAVJUD",
            subtitle: "TELEGRAM KANALIMIZ",
        },
        {
            imageUrl: banner,
            title: "BU YERDA TELEGRAM KANALIMIZ MAVJUD",
            subtitle: "TELEGRAM KANALIMIZ",
        },
        {
            imageUrl: banner,
            title: "BU YERDA TELEGRAM KANALIMIZ MAVJUD",
            subtitle: "TELEGRAM KANALIMIZ",
        },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <HeroBanner banners={banners} />
            <Typography
                variant="h4"
                gutterBottom
                color="primary"
                sx={{ mt: 4, fontWeight: "bold" }}
            >
                🎥 Mashhur Dramalar
            </Typography>
            <DramaList />
        </Container>
    );
}
