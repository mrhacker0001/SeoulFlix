import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

export default function DramaList() {
    const [dramas, setDramas] = useState([]);
    const [user, setUser] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        // 🔹 Auth holatini kuzatish
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        // 🔹 Firestore'dan dramaslarni olish
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "dramas"));
            setDramas(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        };
        fetchData();

        return () => unsubscribe();
    }, []);

    const handleWatch = (videoId) => {
        if (!user) {
            // 🔸 Agar profil yo‘q bo‘lsa — ogohlantirish chiqadi
            setAlertOpen(true);
        } else {
            // 🔸 Agar foydalanuvchi mavjud bo‘lsa — tomosha sahifasiga o‘tadi
            window.location.href = `/drama/${videoId}`;
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
                                transition: "0.3s",
                                "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="220"
                                image={drama.thumbnail}
                                alt={drama.title}
                            />

                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {drama.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Tavsif: {drama.description}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Fasl: {drama.season}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Qism: {drama.episode}
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

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2, borderRadius: 2 }}
                                    onClick={() => handleWatch(drama.videoId)}
                                >
                                    Tomosha qilish →
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 🔹 Snackbar ogohlantirish */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="warning" sx={{ width: "100%" }}>
                    Iltimos, avval profil yarating!
                </Alert>
            </Snackbar>
        </Box>
    );
}
