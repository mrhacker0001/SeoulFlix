import React from "react";
import { Container } from "@mui/material";
import DramaList from "./DramaList";
import HeroBanner from "../Components/HeroBanner";
import taqlid from "./taqlid.jpg"
import nefrit from "./nefritortidan.jpeg"
import oy from "./1765210455_oy-ogushidagi-ishq-s.jpg"
// import { useStoreState } from "../Redux/selector";
// import locale from "../localization/locale.json";

export default function HomePage() {
    // const states = useStoreState();
    // const langData = useMemo(() => locale[states.lang], [states.lang]);
    const banners = [
        {
            imageUrl: nefrit,
            title: "Nefrit ortifan",
            subtitle: "Premyera: Nefrit ortidan 1-qism",
        },
        {
            imageUrl: taqlid,
            title: "Taqlid",
            subtitle: "Premyera: Taqldi 1-qism",
        },
        {
            imageUrl: oy,
            title: "oy og'usidagi ishq",
            subtitle: "Premyera: Oy og'usidagi ishq 1-qism",
        },
    ];

    return (
        <Container sx={{ mt: 10 }}>
            <HeroBanner banners={banners} />
            <DramaList />
        </Container>
    );
}
