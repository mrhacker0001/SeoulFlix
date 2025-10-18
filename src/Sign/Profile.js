import React, { useState, useEffect } from "react";
import {
    getAuth,
    updatePassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import {
    Button,
    Avatar,
    TextField,
    Typography,
    Modal,
    Box,
    Paper,
} from "@mui/material";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function Profile() {
    const auth = getAuth();
    const storage = getStorage();
    const [user, setUser] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setPreview(currentUser?.photoURL || null);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(photo);
        }
    }, [photo]);

    const handlePhotoUpload = async () => {
        if (!photo || !user) return;
        try {
            const storageRef = ref(storage, `profilePhotos/${user.uid}`);
            await uploadBytes(storageRef, photo);
            const url = await getDownloadURL(storageRef);

            await updateProfile(user, { photoURL: url });
            setPreview(url);
            alert("Profil rasmi muvaffaqiyatli yangilandi ✅");
        } catch (err) {
            alert("Xatolik: " + err.message);
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await updatePassword(auth.currentUser, newPassword);
            alert("Parol muvaffaqiyatli yangilandi ✅");
            setOpen(false);
            setNewPassword("");
        } catch (error) {
            alert("Xatolik: " + error.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/signin"; // logoutdan keyin sign in sahifasiga yo‘naltirish
    };

    if (!user) {
        return (
            <Typography align="center" mt={5}>
                Foydalanuvchi tizimga kirmagan 😢
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5,
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    👤 Shaxsiy profil
                </Typography>

                <label htmlFor="upload-photo">
                    <input
                        type="file"
                        accept="image/*"
                        id="upload-photo"
                        style={{ display: "none" }}
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <Avatar
                        src={preview}
                        alt="Profil rasmi"
                        sx={{
                            width: 120,
                            height: 120,
                            mx: "auto",
                            cursor: "pointer",
                            mb: 2,
                        }}
                    />
                </label>

                {photo && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePhotoUpload}
                        sx={{ mb: 2 }}
                    >
                        📤 Yuklash
                    </Button>
                )}

                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Email:</strong> {user.email}
                </Typography>

                <Button
                    variant="outlined"
                    sx={{ mt: 3 }}
                    onClick={() => setOpen(true)}
                >
                    🔒 Parolni o‘zgartirish
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={handleLogout}
                >
                    🚪 Chiqish
                </Button>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" mb={2}>
                            Yangi parol kiriting
                        </Typography>
                        <TextField
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Yangi parol"
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            fullWidth
                            onClick={handlePasswordUpdate}
                        >
                            Tasdiqlash
                        </Button>
                    </Box>
                </Modal>
            </Paper>
        </Box>
    );
}
