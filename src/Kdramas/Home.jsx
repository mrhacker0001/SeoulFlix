import React, { useMemo } from "react";
import { Container } from "@mui/material";
import DramaList from "./DramaList";
import HeroBanner from "../Components/HeroBanner";
import banner from "./reklama.jpeg";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function HomePage() {
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    const banners = [
        {
            imageUrl: banner,
            title: langData.ads,
            subtitle: langData.cooperate,
        },
        {
            imageUrl: banner,
            title: langData.ads,
            subtitle: langData.cooperate,
        },
        {
            imageUrl: banner,
            title: langData.ads,
            subtitle: langData.cooperate,
        },
    ];

    return (
        <Container sx={{ mt: 10 }}>
            <HeroBanner banners={banners} />
            <DramaList />
        </Container>
    );
}
