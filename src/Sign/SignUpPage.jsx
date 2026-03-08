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
    IconButton
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

    const handleSignUp = async () => {
        setError("");
        setLoading(true);
        try {
            if (!isEmailValid) {
                setError(langData.onlygmail);
                setLoading(false);
                return;
            }
            if (!isPhoneValid) {
                setError(langData.requiredphone);
                setLoading(false);
                return;
            }

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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#e50914" },
            "&.Mui-error fieldset": { borderColor: "#ff1744" },
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.6)" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#e50914" },
        "& .MuiFormHelperText-root": { color: "#ff1744", fontWeight: "bold" },
        mb: 2
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
                py: 5,
                px: 2
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 5 },
                    width: "100%",
                    maxWidth: 480,
                    textAlign: "center",
                    bgcolor: "rgba(0, 0, 0, 0.85)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
                }}
            >
                {/* Logo */}
                <Box sx={{ mb: 3 }}>
                    <video
                        src="/seoulflix-animation.mp4"
                        autoPlay loop muted playsInline
                        style={{ width: "140px", height: "auto" }}
                    />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="#fff" mb={1}>
                    {langData.register}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={4}>
                    SeoulFlix olamiga xush kelibsiz!
                </Typography>

                <Stack component="form" noValidate>
                    {/* Ism */}
                    <TextField
                        label={langData.name}
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={textFieldStyle}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Telefon */}
                    <TextField
                        label={langData.phone}
                        fullWidth
                        placeholder="+998901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        sx={textFieldStyle}
                        error={phone.length > 0 && !isPhoneValid}
                        helperText={phone.length > 0 && !isPhoneValid ? langData.requiredphone : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Email */}
                    <TextField
                        label={langData.email}
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={textFieldStyle}
                        error={email.length > 0 && !isEmailValid}
                        helperText={email.length > 0 && !isEmailValid ? langData.onlygmail : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Parol */}
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
                                    <LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        sx={{ color: "rgba(255,255,255,0.4)" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Typography
                            variant="caption"
                            sx={{ color: "#ff1744", display: 'block', mb: 2, textAlign: 'left', fontWeight: 'bold' }}
                        >
                            ⚠️ {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSignUp}
                        disabled={loading || !name || !password || !isEmailValid || !isPhoneValid}
                        startIcon={!loading && <HowToRegIcon />}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            bgcolor: "#e50914",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: "0 8px 16px rgba(229, 9, 20, 0.4)",
                            "&:hover": {
                                bgcolor: "#b20710",
                                transform: "translateY(-1px)",
                                boxShadow: "0 10px 20px rgba(229, 9, 20, 0.5)"
                            },
                            "&:disabled": {
                                bgcolor: "rgba(255, 255, 255, 0.12)",
                                color: "rgba(255, 255, 255, 0.3)"
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : langData.register}
                    </Button>
                </Stack>

                <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <Typography color="rgba(255,255,255,0.5)" variant="body2">
                        {langData.havean}{" "}
                        <Link
                            to="/signin"
                            style={{
                                color: "#e50914",
                                textDecoration: "none",
                                fontWeight: "bold",
                                marginLeft: "5px"
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