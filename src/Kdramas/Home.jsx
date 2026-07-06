import React from "react";
import { Container } from "@mui/material";
import DramaList from "./DramaList";
import HeroBanner from "../Components/HeroBanner";
import taqlid from "./taqlid.jpg"
import nefrit from "./nefritortidan.jpeg"
import overdo from "./overdo.jpeg"
// import reklama from "./reklama.jpeg"
// import { useStoreState } from "../Redux/selector";
// import locale from "../localization/locale.json";

export default function HomePage() {
    // const states = useStoreState();
    // const langData = useMemo(() => locale[states.lang], [states.lang]);
    const banners = [
        {
            imageUrl: nefrit,
            title: "Nefrit ortidan",
            subtitle: "Premyera: Nefrit ortidan 1-qism",

            imdb: "8.6",
            genre: "Drama • Romance",
            year: "2026",
            duration: "45 min",

            quality: "4K UHD",
            status: "ONGOING",


            watchLink: "/drama/LXaRAzz8aZgcsXVQnBmA",
        },

        {
            imageUrl: taqlid,
            title: "Taqlid",
            subtitle: "Premyera: Taqlid 1-qism",

            imdb: "8.0",
            genre: "Drama • Romance",
            year: "2022",
            duration: "20 min",

            quality: "4K UHD",
            status: "ONGOING",


            watchLink: "/drama/Rjvh85aNDRdeDFT9iEG3",
        },

        {
            imageUrl: overdo,
            title: "Nazoratdan chiqqan lahza (Overdo)",
            subtitle: "Premyera: Nazoratdan chiqqan lahza (Overdo) 1-qism",

            imdb: "-",
            genre: "Drama • Romance",
            year: "2026",
            duration: "45 min",

            quality: "4K UHD",
            status: "ONGOING",


            watchLink: "/",
        },
    ];

    return (
        <Container sx={{ mt: 10 }}>
            <HeroBanner banners={banners} />
            <DramaList />
        </Container>
    );
}
