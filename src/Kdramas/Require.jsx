import { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Require() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [offer, setOffer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

    const uzPhoneOk = /^\+998\d{9}$/.test(phone.trim());
    const canSubmit = name.trim().length >= 2 && uzPhoneOk && offer.trim().length >= 5 && !submitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            setAlert({ open: true, type: "error", message: "Ma'lumotlarni to'g'ri kiriting" });
            return;
        }
        setSubmitting(true);
        try {
            await addDoc(collection(db, "requirements"), {
                name: name.trim(),
                phone: phone.trim(),
                offer: offer.trim(),
                createdAt: new Date(),
            });
            setName("");
            setPhone("");
            setOffer("");
            setAlert({ open: true, type: "success", message: "Yuborildi" });
        } catch (err) {
            setAlert({ open: true, type: "error", message: "Xatolik yuz berdi" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
            <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
                Taklif yoki talab yuborish
            </Typography>
            <Typography variant="h5" align="center" fontWeight="400" color="#ababab" fontSize="14px" mb={2}>
                bu yerda taklif yoki saytda mavjud bo'lmagan yoqtirgan daramangiz nomini yozib qoldirishingiz mumkin
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                <TextField
                    label="Ism"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Telefon (+998xxxxxxxxx)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={phone.length > 0 && !uzPhoneOk}
                    helperText={phone.length > 0 && !uzPhoneOk ? "+998 bilan boshlanadigan 12 ta belgidan iborat bo‘lsin" : " "}
                    required
                />
                <TextField
                    label="Taklif"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    multiline
                    minRows={4}
                    required
                />
                <Button type="submit" variant="contained" disabled={!canSubmit}>
                    Jo'natish
                </Button>
            </Box>
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert((a) => ({ ...a, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={alert.type} sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

