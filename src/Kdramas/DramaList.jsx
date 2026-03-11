import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
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

    Chip,
    Stack
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from "react-router-dom";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [user, setUser] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [ratingAvgMap, setRatingAvgMap] = useState({});
    const [ratingCountMap, setRatingCountMap] = useState({});

    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        const fetchDramas = async () => {
            try {
                const q = query(collection(db, "dramas"), orderBy("uploadDate", "desc"));
                const snap = await getDocs(q);
                setDramas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) { console.error("Fetch error:", err); }
        };
        fetchDramas();
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!dramas.length) return;

        const calcRatings = async () => {
            try {
                const results = await Promise.all(
                    dramas.map(async (drama) => {
                        const epsSnap = await getDocs(collection(db, "dramas", drama.id, "episodes"));
                        const ratingSnaps = await Promise.all(
                            epsSnap.docs.map(ep =>
                                getDocs(collection(db, "dramas", drama.id, "episodes", ep.id, "ratings"))
                            )
                        );

                        let totalSum = 0;
                        let totalCount = 0;
                        ratingSnaps.forEach(rSnap => {
                            totalCount += rSnap.size;
                            rSnap.docs.forEach(doc => { totalSum += Number(doc.data()?.value || 0); });
                        });

                        return {
                            id: drama.id,
                            avg: totalCount ? totalSum / totalCount : 0,
                            count: totalCount,
                        };
                    })
                );

                const avgMap = {};
                const countMap = {};
                results.forEach(r => {
                    avgMap[r.id] = r.avg;
                    countMap[r.id] = r.count;
                });
                setRatingAvgMap(avgMap);
                setRatingCountMap(countMap);
            } catch (error) { console.error("Rating calc error:", error); }
        };
        calcRatings();
    }, [dramas]);

    const handleWatch = (dramaId) => {
        if (!user) {
            setAlertOpen(true);
            navigate("/signup");
            return;
        }
        navigate(`/drama/${dramaId}`);
    };

    const renderDramaCard = (drama) => {
        const currentAvg = ratingAvgMap[drama.id] || 0;
        const currentCount = ratingCountMap[drama.id] || 0;

        return (
            <Grid item xs={12} sm={6} md={4} key={drama.id}>
                <Card
                    sx={{
                        maxWidth: 320,
                        mx: "auto",
                        backgroundColor: "#000",
                        border: "2px solid #e50914",
                        borderRadius: "15px",
                        position: "relative",
                        overflow: "hidden",
                        color: "#fff",
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.02)", boxShadow: "0 0 20px rgba(229, 9, 20, 0.5)" }
                    }}
                >
                    <Box sx={{ position: "relative" }}>
                        <CardMedia
                            component="img"
                            image={drama.thumbnail}
                            alt={drama.title}
                            sx={{ height: 400, objectFit: "cover" }}
                        />

                        <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 1 }}>
                            <Chip label="HD" size="small" sx={{ bgcolor: "#e50914", color: "#fff", fontWeight: "bold", borderRadius: 1 }} />
                            <Chip label="SUB" size="small" sx={{ bgcolor: "rgba(0,0,0,0.7)", color: "#fff", fontWeight: "bold", border: "1px solid #fff" }} />
                        </Box>

                        <Box sx={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)"
                        }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: "rgba(0,0,0,0.6)", px: 1, py: 0.2, borderRadius: 5 }}>
                                <StarIcon sx={{ color: "#e50914", fontSize: 16 }} />
                                <Typography variant="caption" fontWeight="bold">{currentAvg.toFixed(1)}</Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ bgcolor: "rgba(255,255,255,0.2)", px: 1, py: 0.2, borderRadius: 1 }}>
                                {drama.ageRating || "13+"}
                            </Typography>
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h6" fontWeight="900" sx={{ textTransform: "uppercase", lineHeight: 1.2, mb: 0.5 }}>{drama.title}</Typography>

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
                            <Chip label={`${drama.episodesCount || 0} Qism`} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#333", height: 20, fontSize: "10px" }} />
                            <Chip label={`${drama.duration || 60} min`} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "#333", height: 20, fontSize: "10px" }} />
                            <Chip
                                label={drama.status === "Yakunlangan" ? "● Yakunlangan" : "● Davom etmoqda"}
                                size="small"
                                sx={{ bgcolor: "#1b5e20", color: "#4caf50", fontWeight: "bold", height: 20, fontSize: "10px" }}
                            />
                        </Stack>

                        <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ textAlign: "left" }}>
                                <Stack direction="row" spacing={0.3} alignItems="baseline">
                                    <Typography variant="h6" color="#e50914" fontWeight="bold">{currentAvg.toFixed(1)}</Typography>
                                    <Typography variant="caption" color="gray">/ 5</Typography>
                                </Stack>
                                <Typography variant="caption" sx={{ color: "gray", fontSize: "10px", display: "block" }}>{currentCount} ovoz</Typography>
                            </Box>

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
                                    "&:hover": { bgcolor: "#b00610" }
                                }}
                            >
                                {langData.watch || "TOMOSHA QILISH"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        );
    };

    return (
        <Box sx={{ bgcolor: "#0b0b0b", minHeight: "100vh", p: 3 }}>
            {["Drama", "Comedy"].map(g => {
                const items = dramas.filter(d => d.genres?.includes(g)).slice(0, 1000);
                if (!items.length) return null;
                return (
                    <Box key={g} mb={6}>
                        <Typography variant="h4" fontWeight="900" color="#fff" mb={3} sx={{ borderLeft: "5px solid #e50914", pl: 2 }}>
                            {langData.genreTitles[g] || g}
                        </Typography>
                        <Grid container spacing={4}>
                            {items.map(renderDramaCard)}
                        </Grid>
                    </Box>
                );
            })}
            <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity="warning">{langData.loginRequired}</Alert>
            </Snackbar>
        </Box>
    );
}

const Divider = ({ sx }) => <Box sx={{ height: "1px", width: "100%", ...sx }} />;