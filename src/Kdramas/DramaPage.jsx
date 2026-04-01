import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate qo'shildi
import { db, auth } from "../firebaseConfig";
import ArtPlayerComponent from "./ArtPlayerComponent";
import TelegramIcon from "@mui/icons-material/Telegram";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import LoginIcon from '@mui/icons-material/Login'; // Login belgisi
import "../App.css"
import {
    collection, getDoc, getDocs, doc, addDoc,
    query, orderBy, onSnapshot, updateDoc, increment, limit
} from "firebase/firestore";
import {
    Box, Typography, Button, CircularProgress, IconButton,
    TextField, Stack, Avatar, Paper, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function DramaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drama, setDrama] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEpisode, setExpandedEpisode] = useState(null);
    const [user, setUser] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [recommended, setRecommended] = useState([]);

    // Snackbar va Dialog uchun holatlar
    const [openSnack, setOpenSnack] = useState(false);
    const [openAuthDialog, setOpenAuthDialog] = useState(false);

    // Oldingi holatlar (states) o'zgarishsiz qoladi...
    // const [likesMap, setLikesMap] = useState({});
    // const [userLikesMap, setUserLikesMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [commentTextMap, setCommentTextMap] = useState({});
    // const [ratingAvgMap, setRatingAvgMap] = useState({});
    // const [ratingCountMap, setRatingCountMap] = useState({});
    // const [userRatingMap, setUserRatingMap] = useState({});

    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
        setIsFavourite(favs.some(item => item.id === id));
    }, [id]);

    // const handleDownload = async (url, title) => {
    //     try {
    //         const response = await fetch(url);
    //         const blob = await response.blob();
    //         const blobUrl = window.URL.createObjectURL(blob);

    //         const link = document.createElement('a');
    //         link.href = blobUrl;
    //         link.setAttribute('download', `${title}.mp4`); // Fayl nomi
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         window.URL.revokeObjectURL(blobUrl);
    //     } catch (error) {
    //         console.error("Yuklab olishda xatolik:", error);
    //         // Agar fetch xato bersa, oddiy link orqali ochish:
    //         window.open(url, '_blank');
    //     }
    // };

    const toggleFavourite = () => {
        let favs = JSON.parse(localStorage.getItem("favourites") || "[]");
        if (isFavourite) {
            favs = favs.filter(item => item.id !== id);
        } else {
            favs.push({
                id: drama.id,
                title: drama.title,
                thumbnail: drama.thumbnail,
                addedAt: new Date().toISOString()
            });
        }
        localStorage.setItem("favourites", JSON.stringify(favs));
        setIsFavourite(!isFavourite);
    };


    useEffect(() => {
        const fetchRecommended = async () => {
            // Faqat 10 ta dramani o'qiymiz, hammasini emas
            const q = query(collection(db, "dramas"), limit(5));
            const snap = await getDocs(q);
            const allDramas = snap.docs.map(d => ({ id: d.id, ...d.data() }));

            const filtered = allDramas
                .filter(d => d.id !== id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);

            setRecommended(filtered);
        };
        fetchRecommended();
    }, [id]);
    // Firebase ma'lumotlarini olish (Sizning kodingiz bilan bir xil)
    useEffect(() => {
        const fetchDrama = async () => {
            try {
                setLoading(true);
                const dramaRef = doc(db, "dramas", id);
                const docSnap = await getDoc(dramaRef);
                if (!docSnap.exists()) { setDrama(null); return; }
                const data = docSnap.data();
                setDrama({ id: docSnap.id, ...data });

                const epSnap = await getDocs(collection(db, "dramas", id, "episodes"));
                const epList = epSnap.docs
                    .map(d => ({ id: d.id, ...d.data(), views: d.data().views || 0 }))
                    .sort((a, b) => Number(a.episode || 0) - Number(b.episode || 0));
                setEpisodes(epList);
                if (epList.length > 0) setExpandedEpisode(epList[0].id);

                epList.forEach(ep => {
                    // const epLikesCol = collection(db, "dramas", id, "episodes", ep.id, "likes");
                    const epCommentsCol = collection(db, "dramas", id, "episodes", ep.id, "comments");
                    // const epRatingsCol = collection(db, "dramas", id, "episodes", ep.id, "ratings");

                    // onSnapshot(epLikesCol, snap => {
                    //     setLikesMap(prev => ({ ...prev, [ep.id]: snap.size }));
                    //     if (user) {
                    //         const userLike = snap.docs.find(d => d.id === user.uid);
                    //         setUserLikesMap(prev => ({ ...prev, [ep.id]: !!userLike }));
                    //     }
                    // });

                    const q = query(epCommentsCol, orderBy("date", "desc"));
                    onSnapshot(q, snap => {
                        setCommentsMap(prev => ({
                            ...prev,
                            [ep.id]: snap.docs.map(d => ({ id: d.id, ...d.data() }))
                        }));
                    });

                    // onSnapshot(epRatingsCol, snap => {
                    //     let sum = 0;
                    //     let currentUserValue = 0;
                    //     snap.docs.forEach(d => {
                    //         const v = Number(d.data()?.value || 0);
                    //         sum += v;
                    //         if (user && d.id === user.uid) currentUserValue = v;
                    //     });
                    //     setRatingAvgMap(prev => ({ ...prev, [ep.id]: snap.size ? sum / snap.size : 0 }));
                    //     setRatingCountMap(prev => ({ ...prev, [ep.id]: snap.size }));
                    //     if (user) setUserRatingMap(prev => ({ ...prev, [ep.id]: currentUserValue }));
                    // });
                });

            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchDrama();
    }, [id, user]);

    // View increment logikasi o'zgarishsiz qoladi...
    useEffect(() => {
        if (!expandedEpisode || !id) return;
        const epRef = doc(db, "dramas", id, "episodes", expandedEpisode);
        updateDoc(epRef, { views: increment(1) }).catch(console.error);
    }, [expandedEpisode, id]);

    // --- MODAL VA SNACKBAR LOGIKASI ---
    const checkAuth = () => {
        if (!user) {
            setOpenAuthDialog(true);
            return false;
        }
        return true;
    };

    // const handleLike = async (epId) => {
    //     if (!checkAuth()) return;
    //     const likeRef = doc(db, "dramas", id, "episodes", epId, "likes", user.uid);
    //     const likeSnap = await getDoc(likeRef);
    //     likeSnap.exists() ? await deleteDoc(likeRef) : await setDoc(likeRef, { createdAt: new Date() });
    // };

    // const handleRateChange = async (epId, value) => {
    //     if (!checkAuth()) return;
    //     if (!value) return;
    //     await setDoc(doc(db, "dramas", id, "episodes", epId, "ratings", user.uid), {
    //         value: Number(value),
    //         createdAt: new Date()
    //     });
    //     setOpenSnack(true); 
    // };

    const handleAddComment = async (epId) => {
        if (!checkAuth()) return;
        const text = commentTextMap[epId]?.trim();
        if (!text) return;
        await addDoc(collection(db, "dramas", id, "episodes", epId, "comments"), {
            userId: user.uid,
            userEmail: user.email,
            text,
            date: new Date()
        });
        setCommentTextMap(prev => ({ ...prev, [epId]: "" }));
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '100vh', bgcolor: '#0b0b0b' }}><CircularProgress sx={{ color: '#e50914' }} /></Box>;
    if (!drama) return <Typography align="center" color="error" mt={5}>{langData.dramaNotFound}</Typography>;

    const activeEp = episodes.find(e => e.id === expandedEpisode);

    return (
        <Box sx={{ bgcolor: "#0b0b0b", minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden", pb: 10 }}>
            {/* Fon rasm */}
            <Box sx={{
                position: "absolute", top: 0, left: 0, right: 0, height: "100dvw",
                backgroundImage: `url(${drama.thumbnail})`,
                backgroundSize: "cover", backgroundPosition: "center",
                filter: "blur(10px) brightness(0.4)", zIndex: 0, opacity: 0.6
            }} />

            <Box sx={{ position: "relative", zIndex: 1, px: { xs: 2, md: 5 }, pt: 4 }}>
                <Typography variant="h3" align="center" fontWeight="900" sx={{ textTransform: "uppercase", fontFamily: 'Equinox', letterSpacing: 2, mb: 1 }}>
                    {drama.title}
                </Typography>

                {/* Qismlar ro'yxati */}
                <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 2, mb: 4, justifyContent: { xs: "flex-start", md: "center" }, "&::-webkit-scrollbar": { display: "none" } }}>
                    {episodes.map((ep) => (
                        <Button
                            key={ep.id}
                            onClick={() => setExpandedEpisode(ep.id)}
                            sx={{
                                minWidth: 100, borderRadius: "8px", fontWeight: "bold",
                                fontFamily: 'GoldenDemo',
                                bgcolor: expandedEpisode === ep.id ? "#e50914" : "rgba(255,255,255,0.1)",
                                color: "#fff", border: expandedEpisode === ep.id ? "none" : "1px solid rgba(255,255,255,0.2)",
                                "&:hover": { bgcolor: expandedEpisode === ep.id ? "#b00610" : "rgba(255,255,255,0.2)" }
                            }}
                        >
                            {ep.episode}-QISM
                        </Button>
                    ))}
                </Stack>

                {activeEp && (
                    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
                        <Paper elevation={24} sx={{ position: "relative", borderRadius: "20px", overflow: "hidden", bgcolor: "#000", border: "2px solid #e50914", boxShadow: "0 0 30px rgba(229, 9, 20, 0.4)" }}>
                            {activeEp.videoId ? <ArtPlayerComponent url={activeEp.videoId} /> :
                                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="error">{langData.videoNotFound}</Typography>
                                </Box>
                            }
                        </Paper>

                        {/* Like, View, Rating */}
                        <Box sx={{
                            mt: 3, p: 2, borderRadius: "15px", bgcolor: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 4, justifyContent: "space-between", flexWrap: "wrap" }}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    {/* <IconButton onClick={() => handleLike(activeEp.id)} sx={{ color: userLikesMap[activeEp.id] ? "#e50914" : "#fff" }}>
                                    <FavoriteIcon />
                                </IconButton>
                                <Typography fontWeight="bold">{likesMap[activeEp.id] || 0}</Typography> */}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, color: "rgba(255,255,255,0.5)" }}>
                                        <VisibilityIcon fontSize="small" />
                                        <Typography variant="body2">{activeEp.views * 13 || 0}</Typography>
                                    </Box>

                                    <Button><IconButton onClick={toggleFavourite} sx={{ color: isFavourite ? "#ffeb3b" : "#fff" }}>
                                        {isFavourite ? <StarIcon /> : <StarOutlineIcon />}
                                    </IconButton><Typography sx={{ fontFamily: 'Delta', color: "#fff" }}>{langData.addtofav}</Typography></Button>

                                </Box>

                                {/* <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Rating
                                    value={userRatingMap[activeEp.id] || 0}
                                    onChange={(e, v) => handleRateChange(activeEp.id, v)}
                                    emptyIcon={<StarIcon style={{ color: "rgba(255,255,255,0.2)" }} fontSize="inherit" />}
                                />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {(ratingAvgMap[activeEp.id] || 0).toFixed(1)} ({ratingCountMap[activeEp.id] || 0})
                                </Typography>
                            </Box> */}

                                <Button variant="contained" startIcon={<TelegramIcon />} href="https://t.me/seoulflix_org" target="_blank" sx={{ bgcolor: "#e50914", fontFamily: 'GoldenDemo', borderRadius: "10px", "&:hover": { bgcolor: "#b00610" } }}>
                                    {langData.upload}
                                </Button>
                                {/* <button
                                    onClick={() => handleDownload(drama.downloadUrl, drama.title)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                                >
                                    <a href={episodes.videoId} download>
                                        Download
                                    </a>
                                </button> */}
                            </Stack>


                            <Typography variant="body2" sx={{ mt: 3, color: "rgba(255,255,255,0.7)", fontStyle: 'italic', lineHeight: 1.8 }}>
                                {drama.description}
                            </Typography>
                        </Box>

                        {/* Comment Section */}
                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, borderLeft: "4px solid #e50914", fontFamily: 'Equinox', pl: 2 }}>
                                FIKR QOLDIRING ({commentsMap[activeEp.id]?.length || 0})
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
                                <IconButton onClick={() => handleAddComment(activeEp.id)} sx={{ bgcolor: "#e50914", color: "#fff", "&:hover": { bgcolor: "#b00610" }, borderRadius: "12px", width: 56 }}>
                                    <SendIcon />
                                </IconButton>
                            </Stack>

                            <Stack spacing={2}>
                                {commentsMap[activeEp.id]?.map((c) => (
                                    <Box key={c.id} sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                            <Avatar sx={{ bgcolor: "#e50914", width: 32, height: 32, fontSize: 14 }}>{c.userEmail?.charAt(0).toUpperCase()}</Avatar>
                                            <Typography variant="subtitle2" fontWeight="bold">{c.userEmail?.split('@')[0]}</Typography>
                                            <Typography variant="caption" color="gray">{c.date?.seconds ? new Date(c.date.seconds * 1000).toLocaleDateString() : new Date(c.date).toLocaleDateString()}</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ pl: 6 }}>{c.text}</Typography>
                                    </Box>
                                ))}
                                {!commentsMap[activeEp.id]?.length && <Typography align="center" color="gray">{langData.noComments}</Typography>}
                            </Stack>
                        </Box>
                        {/* --- TAVSIYA ETILADIGAN DRAMALAR --- */}
                        <Box sx={{ mt: 10, px: { xs: 2, md: 5 } }}>
                            <Typography variant="h5" fontWeight="900" sx={{ mb: 3, borderLeft: "4px solid #e50914", pl: 2, textTransform: "uppercase", fontFamily: 'GoldenDemo', letterSpacing: 2 }}>
                                Sizga yoqishi mumkin
                            </Typography>

                            <Grid container spacing={2}>
                                {recommended.map((rec) => (
                                    <Grid item xs={6} sm={4} md={3} key={rec.id} >
                                        <Box
                                            onClick={() => {
                                                navigate(`/drama/${rec.id}`);
                                                window.scrollTo(0, 0); // Sahifani tepaga qaytarish
                                            }}
                                            sx={{
                                                width: 200,
                                                cursor: "pointer",
                                                transition: "0.3s",
                                                "&:hover": { transform: "scale(1.05)" },
                                            }}
                                        >
                                            <Paper elevation={10} sx={{ borderRadius: "12px", overflow: "hidden", bgcolor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <Box
                                                    component="img"
                                                    src={rec.thumbnail}
                                                    alt={rec.title}
                                                    sx={{ width: "100%", height: { xs: 200, md: 300 }, objectFit: "cover" }}
                                                />
                                                <Box sx={{ p: 1.5, textAlign: "center" }}>
                                                    <Typography variant="subtitle2" noWrap fontWeight="bold" sx={{ color: "#fff" }}>
                                                        {rec.title}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>

                )}


            </Box>

            {/* --- DIZAYN YAXSHILANISHI: AUTH MODAL --- */}
            <Dialog
                open={openAuthDialog}
                onClose={() => setOpenAuthDialog(false)}
                PaperProps={{ sx: { bgcolor: "#1a1a1a", color: "#fff", borderRadius: "15px", border: "1px solid #e50914" } }}
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Ro'yxatdan o'ting
                </DialogTitle>
                <DialogContent>
                    <Typography align="center" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        Like bosish, reyting berish yoki izoh qoldirish uchun tizimga kiring.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button onClick={() => setOpenAuthDialog(false)} sx={{ color: "#fff" }}>Bekor qilish</Button>
                    <Button
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate("/signin")}
                        sx={{ bgcolor: "#e50914", "&:hover": { bgcolor: "#b00610" } }}
                    >
                        Kirish
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)}>
                <Alert severity="success" variant="filled" sx={{ width: '100%', bgcolor: '#2e7d32' }}>
                    Muvaffaqiyatli bajarildi!
                </Alert>
            </Snackbar>
        </Box >
    );
}