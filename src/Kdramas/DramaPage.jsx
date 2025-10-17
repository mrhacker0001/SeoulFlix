import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
    doc,
    updateDoc,
    increment,
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    TextField,
    Button,
    Divider,
    CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function DramaPage() {
    const { videoId } = useParams();
    const [drama, setDrama] = useState(null);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [relatedDramas, setRelatedDramas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrama = async () => {
            const q = query(collection(db, "dramas"), where("videoId", "==", videoId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                const data = docSnap.data();
                setDrama(data);
                setLikes(data.likes || 0);
                setViews((data.views || 0) + 1);

                await updateDoc(docSnap.ref, { views: increment(1) });
            } else {
                console.log("Drama topilmadi");
            }

            // Boshqa dramalarni olish
            const allSnapshot = await getDocs(collection(db, "dramas"));
            const allDramas = allSnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setRelatedDramas(allDramas.filter((d) => d.videoId !== videoId));
        };

        fetchDrama();
    }, [videoId]);

    const handleLike = async () => {
        try {
            const docRef = doc(db, "dramas", videoId);
            await updateDoc(docRef, { likes: increment(1) });
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error("Like bosishda xato:", err);
        }
    };

    const handleAddComment = () => {
        if (comment.trim() === "") return;
        const newComment = { text: comment, date: new Date().toLocaleString() };
        setComments((prev) => [newComment, ...prev]);
        setComment("");
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress color="primary" />
            </Box>
        );

    if (!drama)
        return (
            <Typography align="center" mt={5} color="error">
                Ushbu drama topilmadi 😢
            </Typography>
        );

    return (
        <Box sx={{ p: 3 }}>
            {/* Video nomi */}
            <Typography variant="h4" fontWeight="bold" mb={2} align="center">
                {drama.title}
            </Typography>

            {/* Video */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "100%", maxWidth: "900px" }}>
                    <iframe
                        width="100%"
                        height="500"
                        src={`https://www.youtube.com/embed/${drama.videoId}`}
                        title="Drama video"
                        allowFullScreen
                        style={{
                            borderRadius: "16px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        }}
                    ></iframe>
                </Box>
            </Box>

            {/* Like va prosmotr */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 2,
                    alignItems: "center",
                }}
            >
                <IconButton onClick={handleLike} color="error">
                    <FavoriteIcon />
                </IconButton>
                <Typography>{likes} ta like</Typography>

                <VisibilityIcon sx={{ color: "gray" }} />
                <Typography>{views} marta ko‘rilgan</Typography>
            </Box>

            {/* Tavsif */}
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    {drama.description || "Tavsif mavjud emas"}
                </Typography>
            </Box>

            {/* Commentlar */}
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Fikr qoldiring 💬
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Komment yozing..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                        sx={{ borderRadius: 2 }}
                    >
                        Yuborish
                    </Button>
                </Box>

                {comments.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                        {comments.map((c, i) => (
                            <Card key={i} sx={{ mb: 1, p: 1.5, borderRadius: 2 }}>
                                <Typography variant="body2">{c.text}</Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", textAlign: "right" }}
                                >
                                    {c.date}
                                </Typography>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Hozircha fikrlar yo‘q
                    </Typography>
                )}
            </Box>

            {/* Boshqa dramalar */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Boshqa dramalar 🎥
                </Typography>

                <Grid container spacing={3}>
                    {relatedDramas.slice(0, 3).map((d) => (
                        <Grid item xs={12} sm={6} md={4} key={d.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={d.thumbnail}
                                    alt={d.title}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        {d.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {d.description?.slice(0, 60)}...
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/drama/${d.id}`}
                                        sx={{ mt: 2, borderRadius: 2 }}
                                        fullWidth
                                    >
                                        Tomosha qilish →
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
