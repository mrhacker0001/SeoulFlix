import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    increment,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Card,
    CardContent,
    IconButton,
    TextField,
    Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { onAuthStateChanged } from "firebase/auth";

export default function DramaPage() {
    const { videoId } = useParams();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEpisode, setExpandedEpisode] = useState(null); // 🔹 Qaysi epizod ochilgan
    const [user, setUser] = useState(null);
    const [likesMap, setLikesMap] = useState({}); // 🔹 Har epizod uchun like
    const [commentsMap, setCommentsMap] = useState({}); // 🔹 Har epizod uchun kommentlar
    const [commentTextMap, setCommentTextMap] = useState({}); // 🔹 Har epizod uchun input

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                const dramaRef = doc(db, "dramas", videoId);
                const docSnap = await getDoc(dramaRef);
                if (!docSnap.exists()) return;

                const data = docSnap.data();
                setDrama({ id: docSnap.id, ...data });

                const epSnap = await getDocs(
                    collection(db, "dramas", videoId, "episodes")
                );
                const epList = epSnap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => a.episodeNumber - b.episodeNumber);

                setEpisodes(epList);
                if (epList.length > 0) setExpandedEpisode(epList[0].id);

                // 🔹 Har epizod uchun like va kommentlarni olish
                epList.forEach(async (ep) => {
                    // Likes
                    const likesSnap = await getDocs(
                        collection(db, "dramas", videoId, "episodes", ep.id, "likes")
                    );
                    setLikesMap((prev) => ({
                        ...prev,
                        [ep.id]: likesSnap.size,
                    }));

                    // Comments real-time
                    const commentsRef = collection(
                        db,
                        "dramas",
                        videoId,
                        "episodes",
                        ep.id,
                        "comments"
                    );
                    const q = query(commentsRef, orderBy("date", "desc"));
                    onSnapshot(q, (snapshot) => {
                        setCommentsMap((prev) => ({
                            ...prev,
                            [ep.id]: snapshot.docs.map((doc) => doc.data()),
                        }));
                    });
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrama();
    }, [videoId]);

    const handleLike = async (epId) => {
        if (!user) return alert("Avval tizimga kiring!");

        const likeRef = doc(
            db,
            "dramas",
            videoId,
            "episodes",
            epId,
            "likes",
            user.uid
        );
        const likeSnap = await getDoc(likeRef);

        if (likeSnap.exists()) {
            await deleteDoc(likeRef);
            setLikesMap((prev) => ({ ...prev, [epId]: prev[epId] - 1 }));
        } else {
            await setDoc(likeRef, { createdAt: new Date() });
            setLikesMap((prev) => ({ ...prev, [epId]: prev[epId] + 1 || 1 }));
        }
    };

    const handleAddComment = async (epId) => {
        if (!user) return alert("Komment yozish uchun tizimga kiring!");
        const text = commentTextMap[epId]?.trim();
        if (!text) return;

        await addDoc(
            collection(db, "dramas", videoId, "episodes", epId, "comments"),
            {
                userId: user.uid,
                userEmail: user.email,
                text,
                date: new Date(),
            }
        );
        setCommentTextMap((prev) => ({ ...prev, [epId]: "" }));
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress color="primary" />
            </Box>
        );

    if (!drama)
        return (
            <Typography align="center" color="error" mt={5}>
                Drama topilmadi ❌
            </Typography>
        );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" fontWeight="bold" mb={2}>
                {drama.title}
            </Typography>

            {/* Epizod tugmalari */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
                {episodes.map((ep) => (
                    <Button
                        key={ep.id}
                        variant={expandedEpisode === ep.id ? "contained" : "outlined"}
                        onClick={() => setExpandedEpisode(ep.id)}
                    >
                        {`Qism ${ep.episode}`}
                    </Button>
                ))}
            </Box>

            {/* Faol epizod */}
            {episodes.map(
                (ep) =>
                    expandedEpisode === ep.id && (
                        <Box key={ep.id} sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 4 }}>
                            <Typography variant="h6" mb={1}>
                                {ep.title || `Qism ${ep.episode}`}
                            </Typography>
                            <iframe
                                width="100%"
                                height="500"
                                src={`https://www.youtube.com/embed/${ep.videoId}`}
                                title={ep.title}
                                allowFullScreen
                                style={{
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                }}
                            ></iframe>

                            {/* Like va Kommentlar */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                <IconButton
                                    onClick={() => handleLike(ep.id)}
                                    color={likesMap[ep.id] > 0 ? "error" : "default"}
                                >
                                    <FavoriteIcon sx={{ color: likesMap[ep.id] > 0 ? "red" : "gray" }} />
                                </IconButton>
                                <Typography>{likesMap[ep.id] || 0} ta like</Typography>
                            </Box>

                            {/* Kommentlar */}
                            <Box sx={{ mt: 2 }}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Fikr qoldiring 💬
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder="Komment yozing..."
                                        value={commentTextMap[ep.id] || ""}
                                        onChange={(e) =>
                                            setCommentTextMap((prev) => ({
                                                ...prev,
                                                [ep.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAddComment(ep.id)}
                                    >
                                        Yuborish
                                    </Button>
                                </Box>

                                {commentsMap[ep.id]?.length > 0 ? (
                                    commentsMap[ep.id].map((c, i) => (
                                        <Card key={i} sx={{ mb: 1, p: 1.5 }}>
                                            <Typography variant="body2">{c.text}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(c.date.seconds * 1000).toLocaleString()}
                                            </Typography>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Hozircha fikrlar yo‘q
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )
            )}
        </Box>
    );
}
