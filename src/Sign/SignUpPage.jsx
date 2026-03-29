import React, { useState, useMemo } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    InputAdornment,
    Stack,
    IconButton,
    Alert,
    Collapse
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    // RegEx tekshiruvlari
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^\+998\d{9}$/;
    const isEmailValid = gmailRegex.test(email);
    const isPhoneValid = phoneRegex.test(phone);

    // Firebase xatolarini tushunarli qilish
    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/email-already-in-use":
                return "Ushbu email manzili allaqachon ro'yxatdan o'tkazilgan.";
            case "auth/invalid-email":
                return "Email manzili noto'g'ri.";
            case "auth/operation-not-allowed":
                return "Tizimga kirishga ruxsat berilmagan.";
            case "auth/weak-password":
                return "Parol juda oddiy (kamida 6 ta belgi bo'lishi kerak).";
            case "auth/network-request-failed":
                return "Internet aloqasini tekshiring.";
            default:
                return "Ro'yxatdan o'tishda xatolik yuz berdi. Qayta urinib ko'ring.";
        }
    };

    const handleSignUp = async () => {
        setError("");

        // Forma validatsiyasi
        if (!name.trim()) { setError("Ismingizni kiriting!"); return; }
        if (!isEmailValid) { setError(langData.onlygmail); return; }
        if (!isPhoneValid) { setError(langData.requiredphone); return; }
        if (password.length < 6) { setError("Parol kamida 6 ta belgidan iborat bo'lsin!"); return; }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                phone,
                uid: user.uid,
                createdAt: new Date(),
            });

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
            "&.Mui-error fieldset": { borderColor: "#ff1744" },
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#e50914" },
        "& .MuiFormHelperText-root": { color: "#ff1744", fontWeight: "600" },
        mb: 2
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                background: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6ed7817-6407-4e36-8a50-6ed677943d6c/UZ-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                py: 5,
                px: 2
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    p: { xs: 4, sm: 5 },
                    width: "100%",
                    maxWidth: 480,
                    textAlign: "center",
                    bgcolor: "rgba(15, 15, 15, 0.95)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "28px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.7)"
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <video
                        src="/seoulflix-animation.mp4"
                        autoPlay loop muted playsInline
                        style={{ width: "130px", height: "auto", filter: "drop-shadow(0 0 10px #e50914)" }}
                    />
                </Box>

                <Typography variant="h4" fontWeight="900" color="#fff" mb={1} sx={{ letterSpacing: -0.5 }}>
                    {langData.register}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" mb={4}>
                    Ro'yxatdan o'ting va sevimli dramalaringizdan bahra oling!
                </Typography>

                <Stack component="form" noValidate>
                    {/* Xato xabari uchun Alert */}
                    <Collapse in={!!error} sx={{ mb: 2 }}>
                        <Alert
                            severity="error"
                            variant="filled"
                            icon={<ErrorOutlineIcon fontSize="inherit" />}
                            sx={{ borderRadius: "10px", bgcolor: "#ff1744" }}
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    </Collapse>

                    <TextField
                        label={langData.name}
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label={langData.phone}
                        fullWidth
                        placeholder="+998901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        sx={textFieldStyle}
                        error={phone.length > 4 && !isPhoneValid}
                        helperText={phone.length > 4 && !isPhoneValid ? langData.requiredphone : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label={langData.email}
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={textFieldStyle}
                        error={email.length > 4 && !isEmailValid}
                        helperText={email.length > 4 && !isEmailValid ? langData.onlygmail : ""}
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
                        onClick={handleSignUp}
                        disabled={loading}
                        startIcon={!loading && <HowToRegIcon />}
                        sx={{
                            mt: 2,
                            py: 1.8,
                            bgcolor: "#e50914",
                            fontWeight: "900",
                            borderRadius: "14px",
                            textTransform: "none",
                            fontSize: "1.1rem",
                            transition: "0.4s",
                            "&:hover": {
                                bgcolor: "#ff1f2a",
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 25px rgba(229, 9, 20, 0.5)"
                            },
                            "&:disabled": {
                                bgcolor: "rgba(255, 255, 255, 0.12)",
                                color: "rgba(255, 255, 255, 0.3)"
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={28} sx={{ color: '#fff' }} /> : langData.register}
                    </Button>
                </Stack>

                <Box sx={{ mt: 5, pt: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <Typography color="rgba(255,255,255,0.4)" variant="body2">
                        {langData.havean}{" "}
                        <Link
                            to="/signin"
                            style={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "bold",
                                borderBottom: "2px solid #e50914",
                                marginLeft: "5px",
                                paddingBottom: "2px"
                            }}
                        >
                            {langData.signin}
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignUpPage;