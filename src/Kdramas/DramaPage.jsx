import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    setDoc,
    deleteDoc,
    updateDoc,
    increment,
} from "firebase/firestore";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Card,
    IconButton,
    TextField,
    Divider,
    Rating,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { onAuthStateChanged } from "firebase/auth";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function DramaPage() {
    const { id } = useParams();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEpisode, setExpandedEpisode] = useState(null);
    const [user, setUser] = useState(null);
    const [likesMap, setLikesMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [commentTextMap, setCommentTextMap] = useState({});
    const [ratingAvgMap, setRatingAvgMap] = useState({});
    const [ratingCountMap, setRatingCountMap] = useState({});
    const [userRatingMap, setUserRatingMap] = useState({});
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                const dramaRef = doc(db, "dramas", id);
                const docSnap = await getDoc(dramaRef);

                if (!docSnap.exists()) {
                    console.error("Drama topilmadi");
                    setDrama(null);
                    setLoading(false);
                    return;
                }

                const data = docSnap.data();
                setDrama({ id: docSnap.id, ...data });

                // 🔹 Epizodlarni olish
                const epSnap = await getDocs(collection(db, "dramas", id, "episodes"));
                const epList = epSnap.docs
                    .map((d) => {
                        const data = d.data();
                        return {
                            id: d.id,
                            ...data,
                            views: data.views || 0, // agar views yo‘q bo‘lsa 0
                        };
                    })
                    .sort((a, b) => {
                        const numA = Number(a.episode || 0);
                        const numB = Number(b.episode || 0);
                        return numA - numB;
                    });

                setEpisodes(epList);
                if (epList.length > 0) setExpandedEpisode(epList[0].id);

                // 🔹 Likes & Comments
                epList.forEach((ep) => {
                    const likesRef = collection(db, "dramas", id, "episodes", ep.id, "likes");
                    getDocs(likesRef).then((likesSnap) => {
                        setLikesMap((prev) => ({
                            ...prev,
                            [ep.id]: likesSnap.size,
                        }));
                    });

                    const commentsRef = collection(db, "dramas", id, "episodes", ep.id, "comments");
                    const q = query(commentsRef, orderBy("date", "desc"));
                    onSnapshot(q, (snapshot) => {
                        setCommentsMap((prev) => ({
                            ...prev,
                            [ep.id]: snapshot.docs.map((doc) => doc.data()),
                        }));
                    });

                    const ratingsRef = collection(db, "dramas", id, "episodes", ep.id, "ratings");
                    onSnapshot(ratingsRef, (snap) => {
                        const count = snap.size;
                        let sum = 0;
                        let currentUserValue = 0;
                        snap.docs.forEach((d) => {
                            const v = Number(d.data()?.value || 0);
                            sum += v;
                            if (user && d.id === user.uid) currentUserValue = v;
                        });
                        const avg = count ? sum / count : 0;
                        setRatingAvgMap((prev) => ({ ...prev, [ep.id]: avg }));
                        setRatingCountMap((prev) => ({ ...prev, [ep.id]: count }));
                        if (user) setUserRatingMap((prev) => ({ ...prev, [ep.id]: currentUserValue }));
                    });
                });
            } catch (err) {
                console.error("Xato:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrama();
    }, [id]);

    // 🔹 Epizod ochilganda views ni 1 taga oshirish
    useEffect(() => {
        if (!expandedEpisode || !id) return;

        const updateViews = async () => {
            try {
                const epRef = doc(db, "dramas", id, "episodes", expandedEpisode);
                await updateDoc(epRef, { views: increment(1) });

                // Local state ni ham yangilaymiz
                setEpisodes((prev) =>
                    prev.map((ep) =>
                        ep.id === expandedEpisode
                            ? { ...ep, views: (ep.views || 0) + 1 }
                            : ep
                    )
                );
            } catch (err) {
                console.error("Ko‘rishlar sonini yangilashda xato:", err);
            }
        };

        updateViews();
    }, [expandedEpisode, id]);

    useEffect(() => {
        if (!user || !id || episodes.length === 0) return;
        const fetchUserRatings = async () => {
            try {
                const updates = {};
                for (const ep of episodes) {
                    const userRatingRef = doc(db, "dramas", id, "episodes", ep.id, "ratings", user.uid);
                    const userRatingSnap = await getDoc(userRatingRef);
                    if (userRatingSnap.exists()) {
                        const v = Number(userRatingSnap.data()?.value || 0);
                        updates[ep.id] = v;
                    }
                }
                if (Object.keys(updates).length > 0) {
                    setUserRatingMap((prev) => ({ ...prev, ...updates }));
                }
            } catch (e) {
                console.error("Foydalanuvchi bahosini olishda xato:", e);
            }
        };
        fetchUserRatings();
    }, [user, id, episodes.length]);

    const handleLike = async (epId) => {
        if (!user) return alert(langData.loginFirst);

        const likeRef = doc(db, "dramas", id, "episodes", epId, "likes", user.uid);
        const likeSnap = await getDoc(likeRef);

        if (likeSnap.exists()) {
            await deleteDoc(likeRef);
            setLikesMap((prev) => ({ ...prev, [epId]: prev[epId] - 1 }));
        } else {
            await setDoc(likeRef, { createdAt: new Date() });
            setLikesMap((prev) => ({ ...prev, [epId]: (prev[epId] || 0) + 1 }));
        }
    };

    const handleRateChange = async (epId, value) => {
        if (!user) return alert(langData.loginToRate);
        if (!value) return;
        try {
            const ratingRef = doc(db, "dramas", id, "episodes", epId, "ratings", user.uid);
            await setDoc(ratingRef, { value: Number(value), createdAt: new Date() });
            setUserRatingMap((prev) => ({ ...prev, [epId]: Number(value) }));
        } catch (e) {
            console.error("Bahoni saqlashda xato:", e);
        }
    };

    const handleAddComment = async (epId) => {
        if (!user) return alert(langData.loginToComment);

        const text = commentTextMap[epId]?.trim();
        if (!text) return;

        await addDoc(collection(db, "dramas", id, "episodes", epId, "comments"), {
            userId: user.uid,
            userEmail: user.email,
            text,
            date: new Date(),
        });

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
                {langData.dramaNotFound}
            </Typography>
        );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" fontWeight="bold" mb={2}>
                {drama.title}
            </Typography>

            {/* 🔹 Epizod tugmalari */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >
                {episodes.map((ep) => (
                    <Button
                        key={ep.id}
                        variant={expandedEpisode === ep.id ? "contained" : "outlined"}
                        onClick={() => setExpandedEpisode(ep.id)}
                    >
                        {`${langData.episode} ${ep.episodeNumber || ep.episode}`}
                    </Button>
                ))}
            </Box>

            {/* 🔹 Faol epizod */}
            {episodes.map(
                (ep) =>
                    expandedEpisode === ep.id && (
                        <Box
                            key={ep.id}
                            sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 4 }}
                        >
                            {ep.title || `${langData.episode} ${ep.episode}`}
                            {ep.videoId ? (
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
                            ) : (
                                <Typography color="error" mt={2}>
                                    {langData.videoNotFound}
                                </Typography>
                            )}

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

                            {/* 🔹 Like + Views */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1, flexWrap: "wrap" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <IconButton onClick={() => handleLike(ep.id)}>
                                        <FavoriteIcon
                                            sx={{ color: likesMap[ep.id] > 0 ? "red" : "gray" }}
                                        />
                                    </IconButton>
                                    <Typography>
                                        {likesMap[ep.id] || 0} {langData.likeCount}
                                    </Typography>

                                </Box>

                                <Typography color="text.secondary">
                                    👁️ {ep.views || 0} {langData.views}
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Rating
                                        name={`rating-${ep.id}`}
                                        value={Number(userRatingMap[ep.id] || 0)}
                                        max={5}
                                        onChange={(e, newValue) => handleRateChange(ep.id, newValue)}
                                    />
                                    <Typography color="text.secondary">
                                        {(ratingAvgMap[ep.id]?.toFixed?.(1) || "0.0")} / 5 ({ratingCountMap[ep.id] || 0})
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 🔹 Kommentlar */}
                            <Box sx={{ mt: 2 }}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    {langData.leaveComment}
                                </Typography>

                                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder={langData.leaveComment}
                                        value={commentTextMap[ep.id] || ""}
                                        onChange={(e) =>
                                            setCommentTextMap((prev) => ({
                                                ...prev,
                                                [ep.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <Button variant="contained" onClick={() => handleAddComment(ep.id)}>
                                        {langData.send}
                                    </Button>
                                </Box>

                                {commentsMap[ep.id]?.length > 0 ? (
                                    commentsMap[ep.id].map((c, i) => (
                                        <Card key={i} sx={{ mb: 1, p: 1.5 }}>
                                            <Typography variant="body2">{c.text}</Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {new Date(c.date.seconds * 1000).toLocaleString()}
                                            </Typography>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        {langData.noComments}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )
            )}
        </Box>
    );
}

