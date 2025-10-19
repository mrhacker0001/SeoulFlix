import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroBanner({ banners }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        pauseOnHover: true,
    };

    return (
        <Box sx={{ width: "100%", mb: 4 }}>
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            height: { xs: "220px", sm: "350px", md: "450px" },
                            backgroundImage: `url(${banner.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "20px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Overlay */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.45)",
                            }}
                        />

                        {/* Matn joyi */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: { xs: "20px", sm: "40px" },
                                left: { xs: "20px", sm: "50px" },
                                color: "white",
                                zIndex: 2,
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "1.3rem", sm: "2rem" },
                                    textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
                                }}
                            >
                                {banner.title}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mt: 1,
                                    fontSize: { xs: "0.9rem", sm: "1.2rem" },
                                    textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
                                }}
                            >
                                {banner.subtitle}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}
