import React from "react";
import Slider from "react-slick";
import {
    Box,
    Typography,
    Button,
    Stack,
    Chip,
    IconButton,
    LinearProgress,
} from "@mui/material";

import { Link } from "react-router-dom";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroBanner({ banners }) {

    const settings = {
        dots: true,
        infinite: true,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnHover: true,
        fade: true,
    };

    return (
        <Box
            sx={{
                width: "100%",
                mb: 5,

                ".slick-dots": {
                    bottom: "15px",
                },

                ".slick-dots li button:before": {
                    color: "#fff",
                    opacity: 0.5,
                    fontSize: "10px",
                },

                ".slick-dots li.slick-active button:before": {
                    color: "#e50914",
                    opacity: 1,
                },
            }}
        >
            <Slider {...settings}>
                {banners.map((banner, index) => (

                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            height: {
                                xs: "280px",
                                sm: "450px",
                                md: "600px"
                            },
                            borderRadius: { xs: "14px", sm: "24px" },
                            overflow: "hidden",
                            cursor: "pointer",
                        }}
                    >

                        {/* BACKGROUND */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,

                                backgroundImage: `url(${banner.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",

                                transition: "transform 7s ease",

                                "&:hover": {
                                    transform: "scale(1.08)",
                                }
                            }}
                        />

                        {/* MAIN DARK OVERLAY */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,

                                background: `
                                    linear-gradient(
                                        90deg,
                                        rgba(0,0,0,0.95) 0%,
                                        rgba(0,0,0,0.78) 35%,
                                        rgba(0,0,0,0.30) 70%,
                                        rgba(0,0,0,0.65) 100%
                                    )
                                `,
                            }}
                        />

                        {/* BOTTOM SHADOW */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,

                                background: `
                                    linear-gradient(
                                        to top,
                                        rgba(0,0,0,0.95),
                                        transparent 45%
                                    )
                                `,
                            }}
                        />

                        {/* CONTENT */}
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 2,

                                height: "100%",

                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",

                                px: {
                                    xs: 2,
                                    sm: 6,
                                    md: 8
                                },

                                maxWidth: "720px",
                            }}
                        >

                            {/* TITLE */}
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.4rem",
                                        sm: "3.5rem",
                                        md: "4.7rem"
                                    },

                                    fontWeight: 900,
                                    lineHeight: 1.15,

                                    color: "#fff",

                                    textShadow:
                                        "0 5px 25px rgba(0,0,0,0.9)",

                                    letterSpacing: { xs: "-0.5px", sm: "-2px" },

                                    display: "-webkit-box",
                                    WebkitLineClamp: { xs: 2, sm: "unset" },
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {banner.title}
                            </Typography>

                            {/* SUBTITLE */}
                            <Typography
                                sx={{
                                    mt: { xs: 0.75, sm: 2 },

                                    color: "rgba(255,255,255,0.82)",

                                    fontSize: {
                                        xs: "0.7rem",
                                        sm: "1.1rem"
                                    },

                                    lineHeight: { xs: 1.3, sm: 1.8 },
                                    maxWidth: "620px",

                                    display: { xs: "-webkit-box", sm: "block" },
                                    WebkitLineClamp: { xs: 1, sm: "unset" },
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {banner.subtitle}
                            </Typography>

                            {/* INFO ROW */}
                            <Stack
                                direction="row"
                                spacing={{ xs: 1.5, sm: 3 }}
                                sx={{
                                    mt: { xs: 1.25, sm: 3 },
                                    color: "#fff",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    fontSize: { xs: "0.7rem", sm: "1rem" },
                                }}
                            >

                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <StarIcon
                                        sx={{
                                            color: "#ffd54f",
                                            fontSize: { xs: "0.85rem", sm: "1.1rem" }
                                        }}
                                    />

                                    <Typography fontWeight="bold" fontSize="inherit">
                                        {banner.imdb} IMDB
                                    </Typography>
                                </Stack>

                                <Typography fontSize="inherit">
                                    🎬 {banner.genre}
                                </Typography>

                                <Typography fontSize="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
                                    📺 {banner.year}
                                </Typography>

                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: { xs: "0.8rem", sm: "1rem" }
                                        }}
                                    />

                                    <Typography fontSize="inherit">
                                        {banner.duration}
                                    </Typography>
                                </Stack>

                            </Stack>


                            {/* {banner.progress > 0 && (
                                <Box sx={{ mt: 3, maxWidth: "350px" }}>

                                    <Typography
                                        sx={{
                                            color: "#fff",
                                            mb: 1,
                                            fontSize: ".9rem"
                                        }}
                                    >
                                        Davom ettirish ({banner.progress}%)
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={banner.progress}
                                        sx={{
                                            height: 7,
                                            borderRadius: "20px",

                                            backgroundColor:
                                                "rgba(255,255,255,0.15)",

                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: "#e50914",
                                            }
                                        }}
                                    />
                                </Box>
                            )} */}

                            {/* BUTTONS */}
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    mt: { xs: 1.75, sm: 4 },
                                    flexWrap: "wrap"
                                }}
                            >

                                {/* WATCH */}
                                <Button
                                    component={Link}
                                    to={banner.watchLink}

                                    variant="contained"

                                    startIcon={<PlayArrowIcon />}

                                    sx={{
                                        bgcolor: "#e50914",

                                        px: { xs: 2.5, sm: 4 },
                                        py: { xs: 0.75, sm: 1.5 },

                                        borderRadius: { xs: "10px", sm: "14px" },

                                        fontWeight: "bold",

                                        fontSize: { xs: "0.8rem", sm: "1rem" },

                                        textTransform: "none",

                                        boxShadow:
                                            "0 10px 30px rgba(229,9,20,.4)",

                                        "&:hover": {
                                            bgcolor: "#ff1f2d",
                                            transform: "scale(1.04)",
                                        }
                                    }}
                                >
                                    Tomosha qilish
                                </Button>

                            </Stack>

                        </Box>

                    </Box>
                ))}
            </Slider>
        </Box>
    );
}