import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
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
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [dramas, setDramas] = useState([]);
    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    const filtered = dramas.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "dramas"));
            setDramas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, []);

    const handleClick = (id) => {
        navigate(`/drama/${id}`);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                minHeight: "100vh",
                backgroundColor: "#0b0b0b",
                paddingTop: 4,
                paddingBottom: 6,
            }}
        >

            <TextField
                fullWidth
                label={langData.search}
                variant="outlined"
                sx={{
                    mb: 4,
                    input: { color: "#fff" },
                    label: { color: "#aaa" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#333" },
                        "&:hover fieldset": { borderColor: "#b30000" },
                        "&.Mui-focused fieldset": { borderColor: "#ff0000" },
                        backgroundColor: "#111",
                        borderRadius: "12px",
                    },
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Grid container spacing={3}>
                {filtered.map((drama) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={drama.id}>
                        <Card
                            sx={{
                                backgroundColor: "#111",
                                borderRadius: "18px",
                                overflow: "hidden",
                                position: "relative",
                                transition: "all 0.35s ease",
                                cursor: "pointer",
                                "&:hover": {
                                    transform: "translateY(-8px) scale(1.03)",
                                    boxShadow: "0 20px 40px rgba(255,0,0,0.35)",
                                },
                            }}
                        >
                            <CardActionArea onClick={() => handleClick(drama.id)}>
                                <CardMedia
                                    component="img"
                                    height="260"
                                    image={drama.thumbnail}
                                    alt={drama.title}
                                    sx={{
                                        transition: "all 0.4s ease",
                                        "&:hover": {
                                            transform: "scale(1.08)",
                                        },
                                    }}
                                />

                                <CardContent
                                    sx={{
                                        background:
                                            "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4))",
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: "#fff",
                                            fontWeight: 700,
                                            letterSpacing: "0.3px",
                                        }}
                                    >
                                        {drama.title}
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
