import React, { useState, useEffect, useMemo } from "react";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";
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
    getFirestore,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import {
    Button,
    Avatar,
    TextField,
    Typography,
    Modal,
    Box,
    Paper,
    CircularProgress,
    IconButton,
    Stack,
    Divider,
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: '90%', sm: 400 },
    bgcolor: "#1a1a1a",
    border: "1px solid rgba(229, 9, 20, 0.3)",
    borderRadius: "16px",
    boxShadow: "0 0 20px rgba(0,0,0,0.8)",
    p: 4,
    color: "#fff"
};

export default function Profile() {
    const auth = getAuth();
    const storage = getStorage();
    const db = getFirestore();

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setPreview(currentUser?.photoURL || null);
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth, db]);

    useEffect(() => {
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(photo);
        }
    }, [photo]);

    const handlePhotoUpload = async () => {
        if (!photo || !user) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `profilePhotos/${user.uid}`);
            await uploadBytes(storageRef, photo);
            const url = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL: url });
            await updateDoc(doc(db, "users", user.uid), { photoURL: url });
            setPreview(url);
            setPhoto(null);
            alert(langData.uploadSuccess);
        } catch (err) {
            alert("Xatolik: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword.length < 6) {
            alert(langData.passwordShort);
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            alert(langData.passwordsuccess);
            setOpen(false);
            setNewPassword("");
        } catch (error) {
            alert("Xatolik: " + error.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/signin";
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress sx={{ color: '#e50914' }} />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, color: '#fff' }}>
                <Typography variant="h6">{langData.notlogin}</Typography>
                <Button component="a" href="/signin" sx={{ color: '#e50914', mt: 2 }}>Sign In</Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "radial-gradient(circleAt Center, #1a1a1a 0%, #0b0b0b 100%)",
                px: 2,
                py: 5
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: "24px",
                    width: "100%",
                    maxWidth: 450,
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Qizil neon soya effekti */}
                <Box sx={{
                    position: "absolute", top: -50, right: -50, width: 150, height: 150,
                    bgcolor: "rgba(229, 9, 20, 0.15)", filter: "blur(50px)", borderRadius: "50%"
                }} />

                <Typography variant="h4" fontWeight="900" sx={{ color: "#fff", mb: 4, letterSpacing: 1 }}>
                    {langData.profile.toUpperCase()}
                </Typography>

                {/* Avatar Section */}
                <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                    <Avatar
                        src={preview}
                        sx={{
                            width: 140,
                            height: 140,
                            mx: "auto",
                            border: "3px solid #e50914",
                            boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)",
                        }}
                    />
                    <label htmlFor="upload-photo">
                        <input
                            type="file"
                            accept="image/*"
                            id="upload-photo"
                            style={{ display: "none" }}
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        <IconButton
                            component="span"
                            sx={{
                                position: "absolute",
                                bottom: 5,
                                right: 5,
                                bgcolor: "#e50914",
                                color: "#fff",
                                "&:hover": { bgcolor: "#b20710" },
                                boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
                            }}
                        >
                            <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                    </label>
                </Box>

                {photo && (
                    <Button
                        variant="contained"
                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={uploading}
                        onClick={handlePhotoUpload}
                        sx={{
                            mb: 3, bgcolor: "#00c853", "&:hover": { bgcolor: "#00a142" },
                            borderRadius: "10px", textTransform: "none"
                        }}
                    >
                        {uploading ? "Uploading..." : langData.upload}
                    </Button>
                )}

                {/* User Info List */}
                <Stack spacing={2} sx={{ textAlign: 'left', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                        <BadgeIcon sx={{ color: "#e50914" }} />
                        <Box>
                            <Typography variant="caption" color="gray">{langData.name}</Typography>
                            <Typography variant="body1" fontWeight="bold" color="#fff">{userData?.name || user.displayName || "—"}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                        <EmailIcon sx={{ color: "#e50914" }} />
                        <Box>
                            <Typography variant="caption" color="gray">{langData.email}</Typography>
                            <Typography variant="body1" fontWeight="bold" color="#fff">{user.email}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                        <PhoneIphoneIcon sx={{ color: "#e50914" }} />
                        <Box>
                            <Typography variant="caption" color="gray">{langData.phone1}</Typography>
                            <Typography variant="body1" fontWeight="bold" color="#fff">{userData?.phone || "—"}</Typography>
                        </Box>
                    </Box>
                </Stack>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

                {/* Action Buttons */}
                <Stack spacing={2}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<LockResetIcon />}
                        onClick={() => setOpen(true)}
                        sx={{
                            color: "#fff", borderColor: "rgba(255,255,255,0.3)",
                            borderRadius: "12px", py: 1.2, textTransform: "none",
                            "&:hover": { borderColor: "#e50914", color: "#e50914", bgcolor: "rgba(229, 9, 20, 0.05)" }
                        }}
                    >
                        {langData.changePassword}
                    </Button>

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            bgcolor: "#e50914", borderRadius: "12px", py: 1.2,
                            fontWeight: "bold", textTransform: "none",
                            "&:hover": { bgcolor: "#b20710", transform: "translateY(-2px)" },
                            transition: "0.3s"
                        }}
                    >
                        {langData.logout}
                    </Button>
                </Stack>

                {/* Password Modal */}
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
                            {langData.enterNewPassword}
                        </Typography>
                        <TextField
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    color: "#fff", bgcolor: "rgba(255,255,255,0.05)",
                                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                    "&:hover fieldset": { borderColor: "#e50914" }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 3, bgcolor: "#e50914", borderRadius: "8px", py: 1.5, "&:hover": { bgcolor: "#b20710" } }}
                            fullWidth
                            onClick={handlePasswordUpdate}
                        >
                            {langData.submit}
                        </Button>
                    </Box>
                </Modal>
            </Paper>
        </Box>
    );
}