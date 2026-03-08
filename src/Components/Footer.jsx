import { useMemo, useEffect, useState } from "react";
import { Box, Typography, Link, Grid, Stack, Divider, Skeleton } from "@mui/material";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import locale from "../localization/locale.json";
import { useStoreState } from "../Redux/selector";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Footer() {
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    const [stats, setStats] = useState({ users: 0, views: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const userCount = usersSnap.size;


                const dramasSnap = await getDocs(collection(db, "dramas"));
                let totalViews = 0;

                for (const dramaDoc of dramasSnap.docs) {
                    const episodesSnap = await getDocs(collection(db, "dramas", dramaDoc.id, "episodes"));

                    for (const ep of episodesSnap.docs) {
                        totalViews += (ep.data().views || 0);
                    }
                }

                setStats({ users: userCount, views: totalViews });
            } catch (error) {
                console.error("Statistikani yuklashda xato:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box
            sx={{
                mt: 10,
                pt: 8,
                pb: 4,
                px: { xs: 2, md: 10 },
                backgroundColor: "#0b0b0b",
                borderTop: "1px solid rgba(229, 9, 20, 0.3)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <Box sx={{
                position: "absolute", bottom: -50, left: "50%", transform: "translateX(-50%)",
                width: "300px", height: "150px", background: "rgba(229, 9, 20, 0.2)",
                filter: "blur(100px)", borderRadius: "50%", zIndex: 0
            }} />

            <Grid container spacing={6} justifyContent="space-between" sx={{ position: "relative", zIndex: 1 }}>

                <Grid item xs={12} md={3}>
                    <Typography variant="h5" fontWeight="900" sx={{ color: "#e50914", letterSpacing: 1, mb: 2 }}>
                        SEOULFLIX
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                        {langData.favourite} — O'zbekistondagi eng sifatli koreys dramalari va filmlari portali. Biz bilan sevimli seriallaringizdan zavqlaning.
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3, color: "#fff" }}>
                        {langData.links}
                    </Typography>
                    <Stack spacing={1.5}>
                        {['home', 'help', 'profile'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item === 'home' ? '' : item}`}
                                color="inherit"
                                underline="none"
                                sx={{
                                    color: "rgba(255,255,255,0.5)", "&:hover": { color: "#e50914", pl: 1 },
                                    transition: "0.3s"
                                }}
                            >
                                {langData[item]}
                            </Link>
                        ))}
                    </Stack>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3, color: "#fff" }}>
                        STATISTIKA
                    </Typography>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: "rgba(229, 9, 20, 0.1)", color: "#e50914" }}>
                                <GroupIcon />
                            </Avatar>
                            <Box>
                                {loading ? <Skeleton width={60} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} /> :
                                    <Typography variant="h6" fontWeight="bold"> (stats.users * 116).toLocaleString()+</Typography>}
                                <Typography variant="caption" color="gray">Foydalanuvchilar</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: "rgba(229, 9, 20, 0.1)", color: "#e50914" }}>
                                <BarChartIcon />
                            </Avatar>
                            <Box>
                                {loading ? <Skeleton width={60} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} /> :
                                    <Typography variant="h6" fontWeight="bold">(stats.views * 23).toLocaleString()+</Typography>}
                                <Typography variant="caption" color="gray">Jami ko'rishlar</Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3, color: "#fff" }}>
                        {langData.contact}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
                        Murojaat uchun: <br />
                        <Link href="https://t.me/seoulflix_admin" target="_blank" sx={{ color: "#e50914", textDecoration: "none" }}>@seoulflix_admin</Link>
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <IconButton
                            href="https://t.me/seoulflix_org"
                            target="_blank"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.05)", color: "#fff",
                                "&:hover": { bgcolor: "#0088cc", transform: "translateY(-3px)" }, transition: "0.3s"
                            }}
                        >
                            <TelegramIcon />
                        </IconButton>
                        <IconButton
                            href="https://www.instagram.com/seoul_flix"
                            target="_blank"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.05)", color: "#fff",
                                "&:hover": { bgcolor: "#e1306c", transform: "translateY(-3px)" }, transition: "0.3s"
                            }}
                        >
                            <InstagramIcon />
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>

            <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.05)" }} />

            <Typography
                variant="caption"
                display="block"
                textAlign="center"
                sx={{ color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}
            >
                © {new Date().getFullYear()} SEOULFLIX — {langData.reserve}. <br />
                <Typography component="span" variant="caption" sx={{ fontSize: '10px' }}>DESIGNED BY SHARIFJANOF</Typography>
            </Typography>
        </Box>
    );
}

// Qo'shimcha komponent (Avatar Footer ichida ishlatish uchun)
function Avatar({ children, sx }) {
    return (
        <Box sx={{
            width: 45, height: 45, borderRadius: "12px", display: 'flex',
            alignItems: 'center', justifyContent: 'center', ...sx
        }}>
            {children}
        </Box>
    );
}

function IconButton({ children, href, target, sx }) {
    return (
        <Box
            component="a"
            href={href}
            target={target}
            sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 45, height: 45, borderRadius: "12px", cursor: 'pointer', ...sx
            }}
        >
            {children}
        </Box>
    );
}