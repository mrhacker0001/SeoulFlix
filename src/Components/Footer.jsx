// src/components/Footer.jsx
import { useMemo } from "react";
import { Box, Typography, Link, Grid, Button } from "@mui/material";
import locale from "../localization/locale.json";
import { useStoreState } from "../Redux/selector";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";






export default function Footer() {
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    return (
        <Box
            sx={{
                mt: 6,
                py: 3,
                px: 2,
                backgroundColor: "#0D1117",
                color: "white",
            }}
        >
            <Grid container spacing={2} justifyContent="space-between" textAlign="center" padding={"0 10dvw"}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" fontWeight="bold">
                        🎬 SeoulFlix
                    </Typography>
                    <Typography variant="body2" color="gray">
                        {langData.favourite}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" fontWeight="bold">
                        {langData.links}
                    </Typography>
                    <Link href="/" color="inherit" underline="hover" display="block">
                        {langData.home}
                    </Link>
                    <Link href="/help" color="inherit" underline="hover" display="block">
                        {langData.help}
                    </Link>
                    <Link href="/profile" color="inherit" underline="hover" display="block">
                        {langData.profile}
                    </Link>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" fontWeight="bold">
                        {langData.contact}
                    </Typography>
                    <Typography variant="body2">
                        📧 <a href="https://t.me/seoulflix_admin" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                            @seoulflix_admin
                        </a>
                    </Typography>

                    <Typography variant="body2">
                        📱 <a href="tel:+998873550024" style={{ color: "inherit", textDecoration: "none" }}>
                            +998 87 355 00 24
                        </a>
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {langData.social}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<TelegramIcon />}
                        href="https://t.me/seoulflix_org"
                        target="_blank"
                        sx={{
                            background: "linear-gradient(135deg, #000000 0%, #b30000 100%)",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            padding: "10px 22px",
                            textTransform: "none",
                            boxShadow: "0 6px 18px rgba(179,0,0,0.4)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #b30000 0%, #000000 100%)",
                                boxShadow: "0 10px 24px rgba(179,0,0,0.6)",
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        Telegram
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<InstagramIcon />}
                        href="https://www.instagram.com/seoul_flix?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        sx={{
                            background: "linear-gradient(135deg, #000000 0%, #b30000 100%)",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            padding: "10px 22px",
                            textTransform: "none",
                            boxShadow: "0 6px 18px rgba(179,0,0,0.4)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #b30000 0%, #000000 100%)",
                                boxShadow: "0 10px 24px rgba(179,0,0,0.6)",
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        Instagram
                    </Button>

                </Grid>
            </Grid>

            <Typography
                variant="caption"
                color="gray"
                display="block"
                textAlign="center"
                mt={3}
            >
                © {new Date().getFullYear()} SeoulFlix — {langData.reserve}
            </Typography>
        </Box>
    );
}
