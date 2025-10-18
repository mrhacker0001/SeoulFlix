import React, { useState, useEffect } from 'react';
import {
    getAuth,
    updatePassword,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Avatar, TextField, Typography, Modal, Box } from '@mui/material';
import './Profile.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

function Profile() {
    const auth = getAuth();
    const storage = getStorage();
    const [user, setUser] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

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
            reader.onloadend = () => {
                setPreview(reader.result);
            };
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
            alert("Rasm muvaffaqiyatli yuklandi");
        } catch (err) {
            alert("Xatolik: " + err.message);
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await updatePassword(auth.currentUser, newPassword);
            alert("Parol muvaffaqiyatli yangilandi");
            setOpen(false);
            setNewPassword('');
        } catch (error) {
            alert("Xatolik: " + error.message);
        }
    };

    return (
        <div className="Profile">
            <div className="profile-container">
                <Typography variant="h5" gutterBottom>Personal Profile</Typography>

                <label htmlFor="upload-photo">
                    <input
                        style={{ display: "none" }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <Avatar
                        src={preview}
                        alt="Profil rasmi"
                        sx={{ width: 100, height: 100, cursor: 'pointer' }}
                    />
                </label>

                {photo && (
                    <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={handlePhotoUpload}
                    >
                        📤 Yuklash
                    </Button>
                )}

                <Typography variant="body1" mt={2}>Email: {user?.email}</Typography>

                <Button
                    variant="outlined"
                    sx={{ mt: 3 }}
                    onClick={() => setOpen(true)}
                >
                    🔒 Change password
                </Button>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box sx={style}>
                        <Typography variant="h6">Yangi parol kiriting</Typography>
                        <TextField
                            type="password"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Yangi parol"
                        />
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handlePasswordUpdate}>
                            Tasdiqlash
                        </Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default Profile;
