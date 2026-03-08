import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import ArtPlayerComponent from "./ArtPlayerComponent";
import TelegramIcon from "@mui/icons-material/Telegram";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import {
    collection, getDoc, getDocs, doc, addDoc, query,
    orderBy, onSnapshot, setDoc, deleteDoc, updateDoc, increment,
} from "firebase/firestore";
import {
    Box, Typography, Button, CircularProgress, IconButton,
    TextField,  Rating, Stack, Avatar, Paper
} from "@mui/material";
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
                    setDrama(null);
                    return;
                }

                const data = docSnap.data();
                setDrama({ id: docSnap.id, ...data });

                const epSnap = await getDocs(collection(db, "dramas", id, "episodes"));
                const epList = epSnap.docs
                    .map((d) => ({ id: d.id, ...d.data(), views: d.data().views || 0 }))
                    .sort((a, b) => Number(a.episode || 0) - Number(b.episode || 0));

                setEpisodes(epList);
                if (epList.length > 0) setExpandedEpisode(epList[0].id);

                epList.forEach((ep) => {
                    // Likes listener
                    onSnapshot(collection(db, "dramas", id, "episodes", ep.id, "likes"), (snap) => {
                        setLikesMap(prev => ({ ...prev, [ep.id]: snap.size }));
                    });

                    // Comments listener
                    const q = query(collection(db, "dramas", id, "episodes", ep.id, "comments"), orderBy("date", "desc"));
                    onSnapshot(q, (snapshot) => {
                        setCommentsMap(prev => ({ ...prev, [ep.id]: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
                    });

                    // Ratings listener
                    onSnapshot(collection(db, "dramas", id, "episodes", ep.id, "ratings"), (snap) => {
                        let sum = 0;
                        let currentUserValue = 0;
                        snap.docs.forEach((d) => {
                            const v = Number(d.data()?.value || 0);
                            sum += v;
                            if (user && d.id === user.uid) currentUserValue = v;
                        });
                        setRatingAvgMap(prev => ({ ...prev, [ep.id]: snap.size ? sum / snap.size : 0 }));
                        setRatingCountMap(prev => ({ ...prev, [ep.id]: snap.size }));
                        if (user) setUserRatingMap(prev => ({ ...prev, [ep.id]: currentUserValue }));
                    });
                });
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDrama();
    }, [id, user]);

    useEffect(() => {
        if (!expandedEpisode || !id) return;
        const updateViews = async () => {
            try {
                const epRef = doc(db, "dramas", id, "episodes", expandedEpisode);
                await updateDoc(epRef, { views: increment(1) });
            } catch (err) { console.error(err); }
        };
        updateViews();
    }, [expandedEpisode, id]);

    const handleLike = async (epId) => {
        if (!user) return alert(langData.loginFirst);
        const likeRef = doc(db, "dramas", id, "episodes", epId, "likes", user.uid);
        const likeSnap = await getDoc(likeRef);
        likeSnap.exists() ? await deleteDoc(likeRef) : await setDoc(likeRef, { createdAt: new Date() });
    };

    const handleRateChange = async (epId, value) => {
        if (!user) return alert(langData.loginToRate);
        if (!value) return;
        await setDoc(doc(db, "dramas", id, "episodes", epId, "ratings", user.uid), { value: Number(value), createdAt: new Date() });
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
        setCommentTextMap(prev => ({ ...prev, [epId]: "" }));
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '100vh', bgcolor: '#0b0b0b' }}><CircularProgress sx={{ color: '#e50914' }} /></Box>;
    if (!drama) return <Typography align="center" color="error" mt={5}>{langData.dramaNotFound}</Typography>;

    const activeEp = episodes.find(e => e.id === expandedEpisode);

    return (
        <Box sx={{
            bgcolor: "#0b0b0b", minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden",
            pb: 10
        }}>
            <Box sx={{
                position: "absolute", top: 0, left: 0, right: 0, height: "100dvw",
                backgroundImage: `url(${drama.thumbnail})`,
                backgroundSize: "cover", backgroundPosition: "center",
                filter: "blur(10px) brightness(0.4)", zIndex: 0, opacity: 0.6
            }} />

            <Box sx={{ position: "relative", zIndex: 1, px: { xs: 2, md: 5 }, pt: 4 }}>
                <Typography variant="h3" align="center" fontWeight="900" sx={{ textTransform: "uppercase", letterSpacing: 2, mb: 1 }}>
                    {drama.title}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ color: "rgba(255,255,255,0.6)", mb: 4 }}>
                    {activeEp?.title || `${langData.episode} ${activeEp?.episode}`}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 2, mb: 4, justifyContent: { xs: "flex-start", md: "center" }, "&::-webkit-scrollbar": { display: "none" } }}>
                    {episodes.map((ep) => (
                        <Button
                            key={ep.id}
                            onClick={() => setExpandedEpisode(ep.id)}
                            sx={{
                                minWidth: 100, borderRadius: "8px", fontWeight: "bold",
                                bgcolor: expandedEpisode === ep.id ? "#e50914" : "rgba(255,255,255,0.1)",
                                color: "#fff", border: expandedEpisode === ep.id ? "none" : "1px solid rgba(255,255,255,0.2)",
                                "&:hover": { bgcolor: expandedEpisode === ep.id ? "#b00610" : "rgba(255,255,255,0.2)" }
                            }}
                        >
                            {ep.episodeNumber || ep.episode}-QISM
                        </Button>
                    ))}
                </Stack>

                {activeEp && (
                    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
                        <Paper elevation={24} sx={{
                            position: "relative", borderRadius: "20px", overflow: "hidden", bgcolor: "#000",
                            border: "2px solid #e50914", boxShadow: "0 0 30px rgba(229, 9, 20, 0.4)"
                        }}>
                            {activeEp.videoId ? (
                                <ArtPlayerComponent url={activeEp.videoId} />
                            ) : (
                                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="error">{langData.videoNotFound}</Typography>
                                </Box>
                            )}
                        </Paper>

                        <Box sx={{
                            mt: 3, p: 2, borderRadius: "15px", bgcolor: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleLike(activeEp.id)} sx={{ color: likesMap[activeEp.id] > 0 ? "#e50914" : "#fff" }}>
                                            <FavoriteIcon />
                                        </IconButton>
                                        <Typography variant="caption" sx={{ display: 'block' }}>{likesMap[activeEp.id] || 0} Likes</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center', pt: 1 }}>
                                        <VisibilityIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                                        <Typography variant="caption" sx={{ display: 'block' }}>{activeEp.views || 0} Views</Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Rating
                                        value={Number(userRatingMap[activeEp.id] || 0)}
                                        onChange={(e, v) => handleRateChange(activeEp.id, v)}
                                        emptyIcon={<StarIcon style={{ color: "rgba(255,255,255,0.2)" }} fontSize="inherit" />}
                                    />
                                    <Typography variant="h6" color="#e50914" fontWeight="bold">
                                        {(ratingAvgMap[activeEp.id] || 0).toFixed(1)} <Typography component="span" variant="caption" color="gray">/ 5 ({ratingCountMap[activeEp.id] || 0})</Typography>
                                    </Typography>
                                </Stack>

                                <Button
                                    variant="contained"
                                    startIcon={<TelegramIcon />}
                                    href="https://t.me/seoulflix_org"
                                    target="_blank"
                                    sx={{
                                        bgcolor: "#e50914", borderRadius: "30px", px: 4, fontWeight: "bold",
                                        "&:hover": { bgcolor: "#b00610", transform: "scale(1.05)" }, transition: "0.3s"
                                    }}
                                >
                                    YUKLAB OLISH
                                </Button>
                            </Stack>

                            <Typography variant="body2" sx={{ mt: 3, color: "rgba(255,255,255,0.7)", fontStyle: 'italic' }}>
                                {drama.description}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, borderLeft: "4px solid #e50914", pl: 2 }}>
                                FIKR QOLDIRING <Typography component="span" color="gray">({commentsMap[activeEp.id]?.length || 0})</Typography>
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    placeholder={langData.leaveComment}
                                    value={commentTextMap[activeEp.id] || ""}
                                    onChange={(e) => setCommentTextMap(prev => ({ ...prev, [activeEp.id]: e.target.value }))}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            color: "#fff", bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "#e50914" }
                                        }
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleAddComment(activeEp.id)}
                                    sx={{ bgcolor: "#e50914", color: "#fff", "&:hover": { bgcolor: "#b00610" }, borderRadius: "12px", width: 56 }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Stack>

                            <Stack spacing={2}>
                                {commentsMap[activeEp.id]?.map((c, i) => (
                                    <Box key={i} sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                            <Avatar sx={{ bgcolor: "#e50914", width: 32, height: 32, fontSize: 14 }}>{c.userEmail?.charAt(0).toUpperCase()}</Avatar>
                                            <Typography variant="subtitle2" fontWeight="bold">{c.userEmail?.split('@')[0]}</Typography>
                                            <Typography variant="caption" color="gray">{new Date(c.date.seconds * 1000).toLocaleDateString()}</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ pl: 6 }}>{c.text}</Typography>
                                    </Box>
                                ))}
                                {!commentsMap[activeEp.id]?.length && (
                                    <Typography align="center" color="gray">{langData.noComments}</Typography>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}