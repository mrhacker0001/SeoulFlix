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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [user, setUser] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
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

    const handleWatch = (dramaId) => {
        if (!user) {
            setAlertOpen(true);
        } else {
            navigate(`/drama/${dramaId}`);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={3}>
                {dramas.map((drama) => (
                    <Grid item xs={12} sm={6} md={4} key={drama.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3,
                                overflow: "hidden", // 🔹 ortiqcha rasm chiqmasin
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                width: 330,
                                transition: "0.3s",
                                "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={drama.thumbnail}
                                alt={drama.title}
                                sx={{
                                    height: 350, // 🔹 barcha rasmlar uchun bir xil balandlik
                                    width: "100%",
                                    objectFit: "cover", // 🔹 rasm markazda va to‘liq joylashadi
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
                ))}
            </Grid>

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
