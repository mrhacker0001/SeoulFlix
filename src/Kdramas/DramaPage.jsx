import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    increment,
    doc,
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [relatedDramas, setRelatedDramas] = useState([]);

    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                setError("");

                // videoId bo‘yicha qidiruv
                const q = query(collection(db, "dramas"), where("videoId", "==", videoId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const data = docSnap.data();
                    setDrama({ id: docSnap.id, ...data });
                    setLikes(data.likes || 0);
                    setViews((data.views || 0) + 1);

                    // Ko‘rishlar sonini yangilash
                    await updateDoc(doc(db, "dramas", docSnap.id), {
                        views: increment(1),
                    });
                } else {
                    setError("Drama topilmadi ❌");
                }

                // Boshqa dramalar
                const allDocs = await getDocs(collection(db, "dramas"));
                const all = allDocs.docs.map((d) => ({ id: d.id, ...d.data() }));
                setRelatedDramas(all.filter((d) => d.videoId !== videoId));
            } catch (err) {
                console.error(err);
                setError("Ma'lumotni yuklashda xato yuz berdi 😢");
            } finally {
                setLoading(false);
            }
        };

        fetchDrama();
    }, [videoId]);

    const handleLike = async () => {
        if (!drama) return;
        await updateDoc(doc(db, "dramas", drama.id), { likes: increment(1) });
        setLikes((prev) => prev + 1);
    };

    const handleAddComment = () => {
        if (comment.trim() === "") return;
        const newComment = { text: comment, date: new Date().toLocaleString() };
        setComments([newComment, ...comments]);
        setComment("");
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress color="primary" size={50} />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography align="center" color="error" mt={5}>
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={2} align="center">
                {drama.title}
            </Typography>

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

            {/* Kommentlar */}
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
                    <Button variant="contained" onClick={handleAddComment}>
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
                                <CardMedia component="img" height="200" image={d.thumbnail} alt={d.title} />
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
                                        href={`/drama/${d.videoId}`}
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
