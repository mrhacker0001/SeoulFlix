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
    Rating,
} from "@mui/material";
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
                const q = query(
                    collection(db, "dramas"),
                    orderBy("uploadDate", "desc")
                );

                const snap = await getDocs(q);

                const data = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDramas(data);
            } catch (error) {
                console.error("Fetch dramas error:", error);
            }
        };

        fetchDramas();

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!dramas.length) return;

        const calcRatings = async () => {
            try {
                const results = await Promise.all(
                    dramas.map(async (drama) => {
                        const epsSnap = await getDocs(
                            collection(db, "dramas", drama.id, "episodes")
                        );

                        const ratingSnaps = await Promise.all(
                            epsSnap.docs.map(ep =>
                                getDocs(
                                    collection(
                                        db,
                                        "dramas",
                                        drama.id,
                                        "episodes",
                                        ep.id,
                                        "ratings"
                                    )
                                )
                            )
                        );

                        let totalSum = 0;
                        let totalCount = 0;

                        ratingSnaps.forEach(rSnap => {
                            totalCount += rSnap.size;

                            rSnap.docs.forEach(doc => {
                                totalSum += Number(doc.data()?.value || 0);
                            });
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
            } catch (error) {
                console.error("Rating calc error:", error);
            }
        };

        calcRatings();
    }, [dramas]);

    const handleWatch = (dramaId) => {
        if (!user) {
            setAlertOpen(true);
            return;
        }
        navigate(`/drama/${dramaId}`);
    };

    const targetGenres = ["Drama", "Comedy"];
    const genreTitles = langData.genreTitles;

    const getTopByGenre = (genre) => {
        return dramas
            .filter(d => Array.isArray(d.genres) && d.genres.includes(genre))
            .map(d => ({
                ...d,
                score: Number(ratingAvgMap[d.id] || 0),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    };

    const renderDramaCard = (drama) => (
        <Grid item xs={12} sm={6} md={4} key={drama.id}>
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    width: 300,
                    transition: "0.3s",
                    "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-5px)",
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={drama.thumbnail}
                    alt={drama.title}
                    sx={{ height: 350, objectFit: "cover" }}
                />

                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "auto",
                    }}
                >
                    <Box>
                        <Typography fontSize={20} fontWeight="bold">
                            {drama.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" mb={1}>
                            {drama.description?.length > 100
                                ? drama.description.slice(0, 250) + "..."
                                : drama.description}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            🌐 {langData.language}:{" "}
                            {drama.lang?.toUpperCase() || langData.unknown}
                        </Typography>

                        {!!drama.genres?.length && (
                            <Typography variant="body2" color="text.secondary">
                                🏷 {langData.genres}: {drama.genres.join(", ")}
                            </Typography>
                        )}

                        {!!drama.uploadDate?.seconds && (
                            <Typography variant="caption" color="text.secondary">
                                {langData.uploadedDate}:{" "}
                                {new Date(
                                    drama.uploadDate.seconds * 1000
                                ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Typography>
                        )}

                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Rating
                                value={Number(ratingAvgMap[drama.id] || 0)}
                                precision={0.1}
                                readOnly
                                size="small"
                            />
                            <Typography variant="caption">
                                {(ratingAvgMap[drama.id]?.toFixed?.(1) || "0.0")} / 5 (
                                {ratingCountMap[drama.id] || 0})
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, borderRadius: 2 }}
                        onClick={() => handleWatch(drama.id)}
                    >
                        {langData.watch}
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box p={3}>
            {targetGenres.map(g => {
                const items = getTopByGenre(g);
                if (!items.length) return null;

                return (
                    <Box key={g} mb={4}>
                        <Typography variant="h3" fontWeight={700} mb={2}>
                            {genreTitles[g] || g}
                        </Typography>

                        <Grid container spacing={3}>
                            {items.map(renderDramaCard)}
                        </Grid>
                    </Box>
                );
            })}

            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="warning">
                    {langData.loginRequired}
                </Alert>
            </Snackbar>
        </Box>
    );
}