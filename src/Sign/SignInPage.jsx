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
    Stack
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

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    const handleSignIn = async () => {
        if (!email || !password) {
            setError(langData.empasserror);
            return;
        }
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError(langData.empasserror);
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
        },
        "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.6)" },
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
                background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6ed7817-6407-4e36-8a50-6ed677943d6c/UZ-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                px: 2
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    width: "100%",
                    maxWidth: 450,
                    textAlign: "center",
                    bgcolor: "rgba(0, 0, 0, 0.85)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <video
                        src="/seoulflix-animation.mp4"
                        autoPlay loop muted playsInline
                        style={{ width: "160px", height: "auto" }}
                    />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="#fff" mb={1}>
                    {langData.signin}
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={4}>
                    Sevimli dramalaringizga qaytish vaqti keldi!
                </Typography>

                <Stack component="form" noValidate>
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
                                    <EmailIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
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
                                    <LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
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
                            color="#ff1744"
                            sx={{ display: 'block', mb: 2, textAlign: 'left', pl: 1, fontWeight: 'bold' }}
                        >
                            ⚠️ {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSignIn}
                        disabled={loading}
                        startIcon={!loading && <LoginIcon />}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            bgcolor: "#e50914",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            textTransform: "none",
                            boxShadow: "0 8px 16px rgba(229, 9, 20, 0.3)",
                            "&:hover": {
                                bgcolor: "#b20710",
                                transform: "translateY(-1px)",
                                boxShadow: "0 10px 20px rgba(229, 9, 20, 0.4)"
                            },
                            "&:disabled": { bgcolor: "rgba(229, 9, 20, 0.5)" }
                        }}
                    >
                        {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : langData.signin}
                    </Button>
                </Stack>

                <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <Typography color="rgba(255,255,255,0.5)" variant="body2">
                        {langData.noaccount}{" "}
                        <Link
                            to="/signup"
                            style={{
                                color: "#e50914",
                                textDecoration: "none",
                                fontWeight: "bold",
                                marginLeft: "5px"
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