import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Button, Container } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from "react-router-dom";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState([]);
    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    // LocalStoragedan ma'lumotlarni yuklash
    useEffect(() => {
        const savedFavs = JSON.parse(localStorage.getItem("favourites") || "[]");
        setFavourites(savedFavs);
    }, []);

    // O'chirish funksiyasi
    const removeFavourite = (id) => {
        const updatedFavs = favourites.filter(item => item.id !== id);
        setFavourites(updatedFavs);
        localStorage.setItem("favourites", JSON.stringify(updatedFavs));
    };

    return (
        <Box sx={{ bgcolor: "#0b0b0b", minHeight: "100vh", pt: 12, pb: 8, color: "#fff" }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="900" sx={{ mb: 4, borderLeft: "5px solid #e50914", pl: 2, textTransform: "uppercase" }}>
                    {langData.favourites || "Saralanganlar"}
                </Typography>

                {favourites.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h6" color="gray" mb={3}>
                            Hozircha hech narsa yo'q. Sevimli dramalaringizni qo'shing!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/")}
                            sx={{ bgcolor: "#e50914", "&:hover": { bgcolor: "#b00610" }, borderRadius: "10px" }}
                        >
                            Dramalarni ko'rish
                        </Button>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(3, 1fr)",
                                md: "repeat(4, 1fr)",
                                lg: "repeat(5, 1fr)",
                            },
                            gap: { xs: 1.25, sm: 3 },
                        }}
                    >
                        {favourites.map((drama) => (
                            <Card key={drama.id} sx={{
                                width: "100%",
                                bgcolor: "#1a1a1a",
                                color: "#fff",
                                borderRadius: { xs: "10px", sm: "15px" },
                                position: "relative",
                                transition: "0.2s",
                                "&:hover": { transform: "scale(1.03)", boxShadow: "0 10px 20px rgba(229, 9, 20, 0.2)" }
                            }}>
                                <Box sx={{ position: "relative", aspectRatio: "2 / 3", width: "100%" }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "15px 15px 0 0", cursor: "pointer", objectFit: "cover" }}
                                        image={drama.thumbnail}
                                        alt={drama.title}
                                        onClick={() => navigate(`/drama/${drama.id}`)}
                                    />
                                </Box>
                                <CardContent sx={{ p: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
                                    <Typography variant="subtitle1" noWrap fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                                        {drama.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", mt: 1 }}>
                                        <Button
                                            size="small"
                                            startIcon={<PlayArrowIcon sx={{ fontSize: "14px !important" }} />}
                                            onClick={() => navigate(`/drama/${drama.id}`)}
                                            sx={{ color: "#e50914", fontWeight: "bold", fontSize: { xs: "0.62rem", sm: "0.8rem" }, minWidth: 0, px: 0.5 }}
                                        >
                                            Ko'rish
                                        </Button>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFavourite(drama.id)}
                                            sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#ff1744" } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default FavouritesPage;