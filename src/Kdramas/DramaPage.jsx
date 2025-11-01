import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CircularProgress,
    Button,
    Grid,
    Snackbar,
    Alert,
    TextField,
} from "@mui/material";
import { auth } from "../firebaseConfig";

export default function DramaPage() {
    const { id } = useParams();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedEp, setSelectedEp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
    const [liked, setLiked] = useState(false);

    // 🧩 Bunny kutubxona ID (CRA env)
    const BUNNY_LIBRARY_ID = process.env.REACT_APP_BUNNY_LIBRARY_ID || "523194";

    console.log("🎬 Bunny Library ID:", BUNNY_LIBRARY_ID);

    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                // 🔹 1. Kino ma'lumotlarini olish (API)
                const d = await apiGet(`/api/dramas/${id}`);
                setDrama(d);

                // 🔹 2. Epizodlar ro‘yxatini olish (API)
                const eps = await apiGet(`/api/dramas/${id}/episodes`);
                setEpisodes(eps);
                setSelectedEp(eps[0] || null);

                // 🔹 3. Likes va izohlar
                const likeRes = await apiGet(`/api/dramas/${id}/likes`);
                setLikes(likeRes.likes || 0);
                const cmts = await apiGet(`/api/dramas/${id}/comments`);
                setComments(cmts);
            } catch (error) {
                console.error("❌ Xato:", error);
                setToast({ open: true, msg: "Ma'lumotlarni yuklashda xatolik", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchDrama();
    }, [id]);

    const handleLike = async () => {
        const user = auth.currentUser;
        if (!user) {
            setToast({ open: true, msg: "Yoqtirish uchun tizimga kiring", type: "warning" });
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/api/dramas/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            });
            if (res.status === 409) {
                setToast({ open: true, msg: "Siz allaqachon yoqtirgansiz", type: "info" });
                setLiked(true);
                return;
            }
            if (!res.ok) throw new Error();
            const data = await res.json();
            setLikes(data.likes || 0);
            setLiked(true);
        } catch (e) {
            setToast({ open: true, msg: "Like yuborishda xatolik", type: "error" });
        }
    };

    const handleAddComment = async () => {
        const text = commentText.trim();
        if (!text) {
            setToast({ open: true, msg: "Izoh matni bo'sh bo'lmasin", type: "warning" });
            return;
        }
        const user = auth.currentUser;
        if (!user) {
            setToast({ open: true, msg: "Izoh qoldirish uchun tizimga kiring", type: "warning" });
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/api/dramas/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, user: user.displayName || user.email })
            });
            if (!res.ok) throw new Error();
            const c = await res.json();
            setComments(prev => [c, ...prev]);
            setCommentText("");
            setToast({ open: true, msg: "Izoh qo'shildi", type: "success" });
        } catch (e) {
            setToast({ open: true, msg: "Izoh yuborishda xatolik", type: "error" });
        }
    };

    // 🔹 Yuklanish holati
    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress color="primary" />
            </Box>
        );

    // 🔹 Kino topilmasa
    if (!drama)
        return (
            <Typography align="center" color="error" mt={5}>
                Kino topilmadi
            </Typography>
        );

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", width: "100%" }}>
            {/* Epizodlar */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Epizodlar
            </Typography>

            {episodes.length === 0 ? (
                <Typography color="text.secondary">Epizodlar mavjud emas </Typography>
            ) : (
                <>
                    {/* Episode switcher */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {episodes.map((ep) => (
                            <Button
                                key={ep.id}
                                variant={selectedEp?.id === ep.id ? 'contained' : 'outlined'}
                                size="small"
                                onClick={() => setSelectedEp(ep)}
                            >
                                Qism {ep.episode}
                            </Button>
                        ))}
                    </Box>

                    {selectedEp && (
                        <Grid container spacing={3} sx={{ backgroundColor: "#1c1c1c" }}>
                            <Grid item xs={72} sm={10} md={8} lg={8} xl={6} mx="auto" sx={{ width: "100%" }}>
                                <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, overflow: "hidden", bgcolor: "#1c1c1c", width: "100%" }}>
                                    <Typography variant="h6" fontWeight="bold" mb={2}>
                                        Fasl {selectedEp.season} | Qism {selectedEp.episode}
                                    </Typography>
                                    {selectedEp.videoId ? (
                                        <Box sx={{ position: "relative", width: "100%", borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.4)", mt: 2, aspectRatio: "16 / 9", backgroundColor: "#000" }}>
                                            <iframe
                                                src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${selectedEp.videoId}?autoplay=false`}
                                                title={`Episode ${selectedEp.episode}`}
                                                allowFullScreen
                                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: "inherit", objectFit: "cover" }}
                                            ></iframe>
                                        </Box>
                                    ) : (
                                        <Typography color="error"> Video mavjud emas</Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Nomi: {drama?.title || "Noma'lum"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Tavsifi: {drama?.description || "—"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Yuklangan sana: {selectedEp.uploadDate ? new Date(selectedEp.uploadDate).toLocaleDateString() : "Noma'lum"}
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}

            {/* Like & Comments */}
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleLike} disabled={liked}>
                        Yoqtirish ({likes})
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Izoh qoldiring..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleAddComment}>Yuborish</Button>
                </Box>
                <Box sx={{ display: 'grid', gap: 1 }}>
                    {comments.map((c) => (
                        <Box key={c.id} sx={{ p: 2, borderRadius: 2, bgcolor: '#232323' }}>
                            <Typography variant="subtitle2">{c.user || 'Anon'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(c.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>{c.text}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 4, borderRadius: 2 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                Tepaga qaytish
            </Button>

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast.type} sx={{ width: '100%' }}>
                    {toast.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
