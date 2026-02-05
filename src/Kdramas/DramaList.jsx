import { useEffect, useState } from "react";
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

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [user, setUser] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [ratingAvgMap, setRatingAvgMap] = useState({});
    const [ratingCountMap, setRatingCountMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        const fetchData = async () => {
            const q = query(collection(db, "dramas"), orderBy("uploadDate", "desc"));
            const querySnapshot = await getDocs(q);
            setDramas(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const calcRatings = async () => {
            if (dramas.length === 0) return;
            const avgUpdates = {};
            const countUpdates = {};
            for (const d of dramas) {
                let sum = 0;
                let count = 0;
                const epsSnap = await getDocs(collection(db, "dramas", d.id, "episodes"));
                for (const epDoc of epsSnap.docs) {
                    const ratingsSnap = await getDocs(collection(db, "dramas", d.id, "episodes", epDoc.id, "ratings"));
                    count += ratingsSnap.size;
                    ratingsSnap.docs.forEach((r) => {
                        const v = Number(r.data()?.value || 0);
                        sum += v;
                    });
                }
                avgUpdates[d.id] = count ? sum / count : 0;
                countUpdates[d.id] = count;
            }
            setRatingAvgMap((prev) => ({ ...prev, ...avgUpdates }));
            setRatingCountMap((prev) => ({ ...prev, ...countUpdates }));
        };
        calcRatings();
    }, [dramas]);

    const handleWatch = (dramaId) => {
        if (!user) {
            setAlertOpen(true);
        } else {
            navigate(`/drama/${dramaId}`);
        }
    };

    const targetGenres = ["Drama", "Comedy",];
    const genreTitles = {
        Drama: "Mashhur dramalar",
        Comedy: "Mashhur komediyalar",
    };

    const getTopByGenre = (genre) => {
        const list = dramas.filter(
            (d) => Array.isArray(d.genres) && d.genres.includes(genre)
        );
        const withScores = list
            .map((d) => ({ d, score: Number(ratingAvgMap[d.id] || 0) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((x) => x.d);
        return withScores;
    };

    const renderDramaCard = (drama) => (
        <Grid item xs={12} sm={6} md={4} key={drama.id}>
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: 280,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                }}
            >
                <CardMedia
                    component="img"
                    image={drama.thumbnail}
                    alt={drama.title}
                    sx={{
                        height: 350,
                        width: "100%",
                        objectFit: "cover",
                    }}
                />

                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontSize="20px" fontWeight="bold">
                            {drama.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            fontSize="14px"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            {drama.description?.length > 100
                                ? drama.description.slice(0, 100) + "..."
                                : drama.description}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            🌐 Til: {drama.lang?.toUpperCase() || "Noma’lum"}
                        </Typography>

                        {Array.isArray(drama.genres) && drama.genres.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                🏷 Janrlar: {drama.genres.join(", ")}
                            </Typography>
                        )}

                        {drama.uploadDate?.seconds && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mt={1}
                            >
                                Yuklangan sana:{" "}
                                {new Date(drama.uploadDate.seconds * 1000).toLocaleDateString(
                                    "en-US",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </Typography>
                        )}

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                            <Rating
                                name={`avg-rating-${drama.id}`}
                                value={Number(ratingAvgMap[drama.id] || 0)}
                                precision={0.1}
                                readOnly
                                size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                                {(ratingAvgMap[drama.id]?.toFixed?.(1) || "0.0")} / 5 ({
                                    ratingCountMap[drama.id] || 0
                                })
                            </Typography>
                        </Box>
                    </Box>

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
    );

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            {targetGenres.map((g) => {
                const items = getTopByGenre(g);
                if (items.length === 0) return null;
                return (
                    <Box key={g} sx={{ mb: 4 }}>
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                            {genreTitles[g] || g}
                        </Typography>
                        <Grid container spacing={3}>
                            {items.map((drama) => renderDramaCard(drama))}
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
                <Alert severity="warning" sx={{ width: "100%" }}>
                    Iltimos, avval profil yarating yoki tizimga kiring!
                </Alert>
            </Snackbar>
        </Box>
    );
}
