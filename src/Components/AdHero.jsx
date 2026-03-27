import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const AdHero = () => {
    const adContainer = useRef(null);

    useEffect(() => {
        // Reklama konteyneri borligini va ichi bo'shligini tekshiramiz
        if (adContainer.current && adContainer.current.childNodes.length === 0) {
            const script = document.createElement('script');

            // Siz bergan Adsterra skript manzili
            script.src = "https://pl28994647.profitablecpmratenetwork.com/52/0e/4d/520e4d66c68098229cefb3e8ef9156a2.js";
            script.async = true;
            script.type = "text/javascript";

            adContainer.current.appendChild(script);
        }
    }, []);

    return (
        <Box
            sx={{
                width: "100%",
                mb: 4,
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px", // HeroBanner bilan bir xil
                overflow: "hidden",
                // Reklama joyi uchun vaqtinchalik minimal balandlik (layout sakrab ketmasligi uchun)
                minHeight: { xs: "100px", md: "250px" },
                backgroundColor: "rgba(255, 255, 255, 0.05)" // Sayt qorong'u bo'lsa mos tushadi
            }}
        >
            <div ref={adContainer} style={{ width: '100%' }}>
                {/* Reklama shu yerda paydo bo'ladi */}
            </div>
        </Box>
    );
};

export default AdHero;