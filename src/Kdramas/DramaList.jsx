import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Ro'yxatda faqat qisqa ma'lumot: nom, holat, qismlar soni, badge'lar,
    // "Tomosha qilish" tugmasi. To'liq tavsif/yil/til DramaPage'da ko'rinadi.
    const renderDramaCard = (drama, isSkeleton = false) => {
        return (
            <Card
                key={drama?.id || Math.random()}
                sx={{
                    width: "100%",
                    backgroundColor: "#000",
                    border: "2px solid #e50914",
                    borderRadius: "10px",
                    position: "relative",
                    overflow: "hidden",
                    color: "#fff",
                    transition: "0.2s",
                    "&:hover": !isSkeleton && { transform: "scale(1.02)", boxShadow: "0 0 20px rgba(229, 9, 20, 0.5)" }
                }}
            >
                <Box sx={{ position: "relative", aspectRatio: "2 / 3", width: "100%" }}>
                    {isSkeleton ? (
                        <Skeleton variant="rectangular" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                    ) : (
                        <CardMedia
                            component="img"
                            image={drama.thumbnail}
                            alt={drama.title}
                            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    )}

                    <Box sx={{ position: "absolute", top: 6, left: 6, display: "flex", gap: 0.5 }}>
                        {isSkeleton ? (
                            <Skeleton variant="rectangular" width={44} height={16} sx={{ borderRadius: 1 }} />
                        ) : (
                            <>
                                <Chip label="HD" size="small" sx={{ bgcolor: "#e50914", color: "#fff", fontWeight: "bold", height: 16, fontSize: "8px", "& .MuiChip-label": { px: 0.6 } }} />
                                <Chip label="SUB" size="small" sx={{ bgcolor: "rgba(0,0,0,0.7)", color: "#fff", fontWeight: "bold", border: "1px solid #fff", height: 16, fontSize: "8px", "& .MuiChip-label": { px: 0.6 } }} />
                            </>
                        )}
                    </Box>

                    <Box sx={{ position: "absolute", top: 6, right: 6 }}>
                        {!isSkeleton && (
                            <Typography variant="caption" sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "#fff", px: 0.7, py: 0.1, borderRadius: 1, fontSize: "9px", fontWeight: "bold" }}>
                                {drama.ageRating || "13+"}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ p: 1, textAlign: "center", "&:last-child": { pb: 1 } }}>
                    {isSkeleton ? (
                        <>
                            <Skeleton variant="text" width="85%" height={20} sx={{ mx: "auto", mb: 0.5 }} />
                            <Skeleton variant="rectangular" width="100%" height={26} sx={{ borderRadius: 1, mt: 1 }} />
                        </>
                    ) : (
                        <>
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    lineHeight: 1.15,
                                    fontFamily: 'Equinox',
                                    fontSize: { xs: "0.72rem", sm: "0.95rem" },
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    mb: 0.5,
                                }}
                            >
                                {drama.title}
                            </Typography>

                            <Stack direction="row" justifyContent="center" spacing={0.5} flexWrap="wrap" sx={{ mb: 0.75 }}>
                                <Chip label={`${drama.episodeCount || 0} qism`} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#333", height: 16, fontSize: "8px", "& .MuiChip-label": { px: 0.6 } }} />
                                <Chip
                                    label={drama.status === "Yakunlangan" ? "Yakunlangan" : "Davom etmoqda"}
                                    size="small"
                                    sx={{ bgcolor: "#1b5e20", color: "#4caf50", fontWeight: "bold", height: 16, fontSize: "8px", "& .MuiChip-label": { px: 0.6 } }}
                                />
                            </Stack>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleWatch(drama.id)}
                                endIcon={<PlayArrowIcon sx={{ fontSize: "14px !important" }} />}
                                size="small"
                                sx={{
                                    bgcolor: "#e50914",
                                    borderRadius: "6px",
                                    fontSize: { xs: "9px", sm: "11px" },
                                    fontWeight: "bold",
                                    py: 0.5,
                                    fontFamily: 'GoldenDemo',
                                    minWidth: 0,
                                    "&:hover": { bgcolor: "#b00610" }
                                }}
                            >
                                {langData.watch || "TOMOSHA QILISH"}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ bgcolor: "#0b0b0b", minHeight: "100vh", p: { xs: 1.5, sm: 3 } }}>
            {["Drama", "Comedy"].map(g => {
                const items = dramas.filter(d => d.genres?.includes(g)).slice(0, 1000);
                const showItems = loading ? Array.from(new Array(4)) : items; // Skeleton yoki haqiqiy drama
                return (
                    <Box key={g} mb={{ xs: 4, sm: 6 }}>
                        <Typography variant="h4" fontWeight="900" color="#fff" mb={{ xs: 2, sm: 3 }} sx={{ borderLeft: "5px solid #e50914", pl: 2, fontSize: { xs: "1.3rem", sm: "2rem" } }}>
                            {langData.genreTitles[g] || g}
                        </Typography>

                        {/* MUI Grid o'rniga CSS Grid - turli qurilma/WebView'larda ustunlar
                            sonini barqaror va oldindan aytib bo'ladigan qilib beradi */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(2, 1fr)",
                                    sm: "repeat(3, 1fr)",
                                    md: "repeat(4, 1fr)",
                                    lg: "repeat(5, 1fr)",
                                },
                                gap: { xs: 1.25, sm: 2.5 },
                            }}
                        >
                            {showItems.map((d) => renderDramaCard(d, loading))}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}