import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    Stack,
    Skeleton
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from "react-router-dom";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    useEffect(() => {
        const fetchDramas = async () => {
            try {
                const q = query(collection(db, "dramas"), orderBy("uploadDate", "desc"));
                const snap = await getDocs(q);
                setDramas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDramas();
    }, []);

    const handleWatch = (dramaId) => {
        navigate(`/drama/${dramaId}`);
    };

    const renderDramaCard = (drama, isSkeleton = false) => {
        return (
            <Grid item xs={12} sm={6} md={4} key={drama?.id || Math.random()}>
                <Card
                    sx={{
                        width: 300,
                        mx: "auto",
                        backgroundColor: "#000",
                        border: "2px solid #e50914",
                        borderRadius: "15px",
                        position: "relative",
                        overflow: "hidden",
                        color: "#fff",
                        transition: "0.3s",
                        "&:hover": !isSkeleton && { transform: "scale(1.02)", boxShadow: "0 0 20px rgba(229, 9, 20, 0.5)" }
                    }}
                >
                    <Box sx={{ position: "relative" }}>
                        {isSkeleton ? (
                            <Skeleton variant="rectangular" height={400} width={800} />
                        ) : (
                            <CardMedia
                                component="img"
                                image={drama.thumbnail}
                                alt={drama.title}
                                sx={{ height: 400, objectFit: "cover" }}
                            />
                        )}

                        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 1 }}>
                            {isSkeleton ? (
                                <>
                                    <Skeleton variant="rectangular" width={30} height={20} sx={{ borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" width={30} height={20} sx={{ borderRadius: 1 }} />
                                </>
                            ) : (
                                <>
                                    <Chip label="HD" size="small" sx={{ bgcolor: "#e50914", color: "#fff", fontWeight: "bold", borderRadius: 1 }} />
                                    <Chip label="SUB" size="small" sx={{ bgcolor: "rgba(0,0,0,0.7)", color: "#fff", fontWeight: "bold", border: "1px solid #fff" }} />
                                </>
                            )}
                        </Box>

                        <Box sx={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)"
                        }}>
                            {isSkeleton ? (
                                <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
                            ) : (
                                <Typography variant="caption" sx={{ bgcolor: "rgba(255,255,255,0.2)", px: 1, py: 0.2, borderRadius: 1 }}>
                                    {drama.ageRating || "13+"}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                        {isSkeleton ? (
                            <>
                                <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
                                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight="900" sx={{ textTransform: "uppercase", lineHeight: 1.2, mb: 0.5, fontFamily: 'Equinox' }}>{drama.title}</Typography>

                                <Typography variant="caption" sx={{ color: "#ababab", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 2, minHeight: "32px" }}>
                                    {drama.description}
                                </Typography>

                                <Divider sx={{ bgcolor: "#333", mb: 1.5 }} />

                                <Stack direction="row" justifyContent="center" spacing={1} sx={{ fontSize: "12px", color: "#fff", mb: 1 }}>
                                    <Typography variant="caption" fontWeight="bold">{drama.year || 2024}</Typography>
                                    <Typography variant="caption">|</Typography>
                                    <Typography variant="caption">{drama.lang?.toUpperCase() || "KR"}</Typography>
                                    <Typography variant="caption">|</Typography>
                                    <Typography variant="caption" sx={{ color: "#e50914" }}>UZ Sub/Dub</Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                    <Chip label={`${drama.episodeCount || 0} Qism`} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#333", height: 20, fontSize: "10px" }} />
                                    <Chip label={`${drama.duration || 60} min`} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#333", height: 20, fontSize: "10px" }} />
                                    <Chip
                                        label={drama.status === "Yakunlangan" ? "● Yakunlangan" : "● Davom etmoqda"}
                                        size="small"
                                        sx={{ bgcolor: "#1b5e20", color: "#4caf50", fontWeight: "bold", height: 20, fontSize: "10px" }}
                                    />
                                </Stack>

                                <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleWatch(drama.id)}
                                        endIcon={<PlayArrowIcon />}
                                        sx={{
                                            bgcolor: "#e50914",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            px: 2,
                                            fontFamily: 'GoldenDemo',
                                            "&:hover": { bgcolor: "#b00610" }
                                        }}
                                    >
                                        {langData.watch || "TOMOSHA QILISH"}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        );
    };

    return (
        <Box sx={{ bgcolor: "#0b0b0b", minHeight: "100vh", p: 3 }}>
            {["Drama", "Comedy"].map(g => {
                const items = dramas.filter(d => d.genres?.includes(g)).slice(0, 1000);
                const showItems = loading ? Array.from(new Array(3)) : items; // Skeleton yoki haqiqiy drama
                return (
                    <Box key={g} mb={6}>
                        <Typography variant="h4" fontWeight="900" color="#fff" mb={3} sx={{ borderLeft: "5px solid #e50914", pl: 2 }}>
                            {langData.genreTitles[g] || g}
                        </Typography>
                        <Grid container spacing={4}>
                            {showItems.map((d, idx) => renderDramaCard(d, loading))}
                        </Grid>
                    </Box>
                );
            })}
        </Box>
    );
}

const Divider = ({ sx }) => <Box sx={{ height: "1px", width: "100%", ...sx }} />;