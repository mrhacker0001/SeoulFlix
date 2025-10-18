import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CircularProgress,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Email yoki parol noto‘g‘ri");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ p: 4, width: 400, textAlign: "center" }}>
                <Typography variant="h5" mb={2}>Sign In</Typography>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <Typography color="error" mt={1}>
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSignIn}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>

                <Typography mt={2}>
                    Don’t have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
            </Card>
        </Box>
    );
};

export default SignInPage;
