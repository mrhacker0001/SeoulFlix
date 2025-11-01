import React, { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (query.trim() === "") return;
            try {
                const data = await apiGet(`/api/search?q=${encodeURIComponent(query)}`);
                setResults(data || []);
            } catch (e) {
                console.error(e);
            }
        };

        const timer = setTimeout(fetchData, 500); // 0.5 soniya kechiktirish
        return () => clearTimeout(timer);
    }, [query]);

    const handleClick = (id) => {
        navigate(`/drama/${id}`);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <TextField
                fullWidth
                label="Film yoki drama nomini yozing..."
                variant="outlined"
                sx={{ mb: 4 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Grid container spacing={3}>
                {results.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} key={movie.id}>
                        <Card sx={{ bgcolor: "background.paper" }}>
                            <CardActionArea onClick={() => handleClick(movie.id)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={movie.thumbnail || "https://via.placeholder.com/500x750?text=No+Image"}
                                    alt={movie.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">
                                        {movie.title || movie.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {movie.uploadDate ? new Date(movie.uploadDate).toLocaleDateString() : "Sana noma’lum"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

