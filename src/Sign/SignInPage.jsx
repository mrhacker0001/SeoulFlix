import React, { useState, useMemo } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    InputAdornment,
    IconButton,
    Stack,
    Alert,
    Collapse
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    // Firebase xatolarini chiroyli tarjima qilish funksiyasi
    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Email manzili noto'g'ri formatda.";
            case "auth/user-disabled":
                return "Ushbu foydalanuvchi bloklangan.";
            case "auth/user-not-found":
                return "Bunday email bilan foydalanuvchi topilmadi.";
            case "auth/wrong-password":
                return "Parol noto'g'ri kiritildi. Iltimos, qayta urinib ko'ring.";
            case "auth/too-many-requests":
                return "Haddan tashqari ko'p urinish! Bir ozdan keyin harakat qiling.";
            case "auth/network-request-failed":
                return "Internet aloqasi yo'q. Tarmoqni tekshiring.";
            case "auth/invalid-credential":
                return "Email yoki parol xato. Ma'lumotlarni tekshiring.";
            default:
                return "Tizimga kirishda xatolik yuz berdi. Qayta urinib ko'ring.";
        }
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            console.error(err.code);
            setError(getFriendlyErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "14px",
            transition: "0.3s",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&.Mui-focused fieldset": {
                borderColor: "#e50914",
                boxShadow: "0 0 10px rgba(229, 9, 20, 0.2)"
            },
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#e50914" },
        mb: 2.5
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6ed7817-6407-4e36-8a50-6ed677943d6c/UZ-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                px: 2
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    p: { xs: 4, sm: 6 },
                    width: "100%",
                    maxWidth: 450,
                    textAlign: "center",
                    bgcolor: "rgba(15, 15, 15, 0.95)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.6)"
                }}
            >
                {/* Logo qismi */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        component="img"
                        src="/seoulflix-logo.png" // Video o'rniga rasm yoki logo bo'lsa yaxshi
                        sx={{ width: 180, filter: "drop-shadow(0 0 10px rgba(229, 9, 20, 0.5))" }}
                        onError={(e) => { e.target.style.display = 'none'; }} // Agar rasm bo'lmasa xato bermasligi uchun
                    />
                </Box>

                <Typography variant="h4" fontWeight="900" color="#fff" mb={1} sx={{ letterSpacing: -0.5 }}>
                    {langData.signin}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" mb={4}>
                    Sevimli dramalaringizni tomosha qilishda davom eting!
                </Typography>

                <Stack component="form" noValidate>
                    {/* Xatolik chiqishi uchun Collapse effektli Alert */}
                    <Collapse in={!!error} sx={{ mb: 2 }}>
                        <Alert
                            severity="error"
                            variant="filled"
                            icon={<ErrorOutlineIcon fontSize="inherit" />}
                            sx={{
                                bgcolor: "#ff1744",
                                borderRadius: "10px",
                                fontWeight: "bold",
                                fontSize: "0.85rem"
                            }}
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    </Collapse>

                    <TextField
                        label={langData.email}
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label={langData.password}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#fff" } }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSignIn}
                        disabled={loading}
                        startIcon={!loading && <LoginIcon />}
                        sx={{
                            mt: 1,
                            py: 1.8,
                            bgcolor: "#e50914",
                            fontWeight: "900",
                            fontSize: "1.1rem",
                            borderRadius: "14px",
                            textTransform: "none",
                            transition: "0.4s",
                            "&:hover": {
                                bgcolor: "#ff1f2a",
                                transform: "scale(1.02)",
                                boxShadow: "0 10px 25px rgba(229, 9, 20, 0.5)"
                            },
                            "&:disabled": { bgcolor: "rgba(229, 9, 20, 0.4)", color: "rgba(255,255,255,0.5)" }
                        }}
                    >
                        {loading ? <CircularProgress size={28} sx={{ color: '#fff' }} /> : langData.signin}
                    </Button>
                </Stack>

                <Box sx={{ mt: 5, pt: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <Typography color="rgba(255,255,255,0.4)" variant="body2">
                        {langData.noaccount}{" "}
                        <Link
                            to="/signup"
                            style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "bold",
                                borderBottom: "2px solid #e50914",
                                marginLeft: "5px",
                                paddingBottom: "2px"
                            }}
                        >
                            {langData.register}
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignInPage;