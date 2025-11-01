import { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api";

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDramas = async () => {
            try {
                const data = await apiGet('/api/dramas');
                setDramas(data);
            } catch (error) {
                console.error("Xato:", error);
            }
        };
        fetchDramas();
    }, []);

    const handleWatch = (dramaId) => {
        navigate(`/drama/${dramaId}`);
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={3}>
                {dramas.map((drama) => (
                    <Grid item xs={12} sm={6} md={6} key={drama.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                transition: "0.3s",
                                "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={drama.thumbnail}
                                alt={drama.title}
                                sx={{
                                    height: 360,
                                    width: 330,
                                    objectFit: "cover",
                                }}
                            />


                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontSize="20px" fontWeight="bold">
                                    {drama.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    🌐 Til: {drama.lang || "Noma'lum"}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    mt={1}
                                >
                                    📅 Yuklangan sana:{" "}
                                    {drama.uploadDate
                                        ? new Date(drama.uploadDate).toLocaleDateString()
                                        : "Noma'lum"}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                    👍 Yoqtirishlar: {typeof drama.likes === 'number' ? drama.likes : 0}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2, borderRadius: 2 }}
                                    onClick={() => handleWatch(drama.id)}
                                >
                                    Tomosha qilish →
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="warning" sx={{ width: "100%" }}>
                    Iltimos, tizimga kiring!
                </Alert>
            </Snackbar>
        </Box>
    );
}

