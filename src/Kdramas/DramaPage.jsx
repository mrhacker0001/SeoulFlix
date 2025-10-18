import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    increment,
    doc,
    addDoc,
    orderBy,
    onSnapshot,
    deleteDoc,
    getDoc,
    setDoc
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
import { onAuthStateChanged } from "firebase/auth";

export default function DramaPage() {
    const { videoId } = useParams();
    const [drama, setDrama] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [relatedDramas, setRelatedDramas] = useState([]);


    // 🔹 Foydalanuvchini olish
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // 🔹 Asosiy drama ma'lumotini olish
    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                setError("");

                const q = query(collection(db, "dramas"), where("videoId", "==", videoId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    const data = docSnap.data();
                    setDrama({ id: docSnap.id, ...data });
                    setLikes(data.likes || 0);
                    setViews((data.views || 0) + 1);

                    // 🔸 Ko‘rishlar sonini oshirish
                    await updateDoc(doc(db, "dramas", docSnap.id), {
                        views: increment(1),
                    });

                    // 🔸 Agar foydalanuvchi like bosgan bo‘lsa
                    if (user) {
                        const likeRef = doc(db, "dramas", docSnap.id, "likes", user.uid);
                        const likeSnap = await getDocs(collection(db, `dramas/${docSnap.id}/likes`));
                        likeSnap.forEach((d) => {
                            if (d.id === user.uid) setLiked(true);
                        });
                    }
                } else {
                    setError("Drama topilmadi ❌");
                }

                // 🔸 Boshqa dramalar
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
    }, [videoId, user]);

    // 🔹 Kommentlarni real-time olish
    useEffect(() => {
        if (!drama) return;
        const commentsRef = collection(db, "dramas", drama.id, "comments");
        const q = query(commentsRef, orderBy("date", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()));
        });

        return () => unsubscribe();
    }, [drama]);


    const handleLike = async (dramaId, userId) => {
        if (!userId) {
            alert("Like bosish uchun tizimga kiring!");
            return;
        }

        try {
            const likeRef = doc(db, "dramas", dramaId, "likes", userId);
            const likeSnap = await getDoc(likeRef);

            if (likeSnap.exists()) {
                // 🔸 Agar oldin like bosgan bo‘lsa — unlike qilamiz
                await deleteDoc(likeRef);
                await updateDoc(doc(db, "dramas", dramaId), {
                    likes: increment(-1), // 🔽 umumiy like sonini kamaytirish
                });
                setLikes((prev) => prev - 1);
                setLiked(false);
            } else {
                // 🔸 Yangi like yaratamiz
                await setDoc(likeRef, { createdAt: new Date() });
                await updateDoc(doc(db, "dramas", dramaId), {
                    likes: increment(1), // 🔼 umumiy like sonini oshirish
                });
                setLikes((prev) => prev + 1);
                setLiked(true);
            }
        } catch (error) {
            console.error("Like error:", error);
            alert("Xatolik yuz berdi, keyinroq urinib ko‘ring!");
        }
    };


    // 🔹 Komment qo‘shish funksiyasi
    const handleAddComment = async () => {
        if (!user) {
            alert("Komment yozish uchun tizimga kiring!");
            return;
        }
        if (comment.trim() === "") return;

        const commentData = {
            userId: user.uid,
            userEmail: user.email,
            text: comment.trim(),
            date: new Date(),
        };

        await addDoc(collection(db, "dramas", drama.id, "comments"), commentData);
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
                <IconButton
                    onClick={() => handleLike(drama.id, user?.uid)} // ✅ Parametrlar bilan chaqiramiz
                    color={liked ? "error" : "default"}
                >
                    <FavoriteIcon sx={{ color: liked ? "red" : "gray" }} />
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
                                    {new Date(c.date.seconds * 1000).toLocaleString()}
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
