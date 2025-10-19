import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CircularProgress,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setError("");
        setLoading(true);
        try {
            // 🔹 Firebase Authentication orqali foydalanuvchini yaratish
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔹 Foydalanuvchi profilini yangilash
            await updateProfile(user, { displayName: name });

            // 🔹 Firestore'ga foydalanuvchi ma'lumotlarini yozish
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                phone,
                createdAt: new Date(),
            });

            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ p: 4, width: 400, textAlign: "center" }}>
                <Typography variant="h5" mb={2}>Sign Up</Typography>

                <TextField
                    label="Ism"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    label="Telefon raqam"
                    fullWidth
                    margin="normal"
                    type="tel"
                    placeholder="+998901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Parol"
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
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Ro‘yxatdan o‘tish"}
                </Button>

                <Typography mt={2}>
                    Allaqachon hisobingiz bormi? <Link to="/signin">Kirish</Link>
                </Typography>
            </Card>
        </Box>
    );
};

export default SignUpPage;
