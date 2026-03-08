// src/pages/Require.jsx
import { useState, useMemo } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Paper,
    InputAdornment
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ChatIcon from '@mui/icons-material/Chat';

export default function Require() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [offer, setOffer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    const theme = {
        red: "#E50914",
        black: "#000000",
        darkGray: "#141414",
        lightGray: "#333333",
        textSecondary: "#b3b3b3"
    };

    const uzPhoneOk = /^\+998\d{9}$/.test(phone.trim());
    const canSubmit = name.trim().length >= 2 && uzPhoneOk && offer.trim().length >= 5 && !submitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            setAlert({ open: true, type: "error", message: langData.formError });
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
            setName(""); setPhone(""); setOffer("");
            setAlert({ open: true, type: "success", message: langData.formSuccess });
        } catch (err) {
            setAlert({ open: true, type: "error", message: langData.formFail });
        } finally {
            setSubmitting(false);
        }
    };

    const textFieldStyles = {
        "& .MuiOutlinedInput-root": {
            color: "white",
            "& fieldset": { borderColor: theme.lightGray },
            "&:hover fieldset": { borderColor: theme.red },
            "&.Mui-focused fieldset": { borderColor: theme.red },
        },
        "& .MuiInputLabel-root": { color: theme.textSecondary },
        "& .MuiInputLabel-root.Mui-focused": { color: theme.red },
        mb: 2,
    };

    return (
        <Box sx={{
            backgroundColor: theme.black,
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            py: 5
        }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    maxWidth: 500,
                    mx: "auto",
                    backgroundColor: theme.darkGray,
                    borderRadius: 3,
                    border: `1px solid ${theme.lightGray}`,
                    width: "100%"
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Typography
                        variant="h4"
                        fontWeight="900"
                        color="white"
                        gutterBottom
                        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                    >
                        {langData.requireTitle}
                    </Typography>
                    <Typography color={theme.textSecondary}>
                        {langData.requireSubtitle}
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label={langData.name}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={textFieldStyles}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: theme.red }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label={langData.phone}
                        value={phone}
                        placeholder="+998901234567"
                        onChange={(e) => setPhone(e.target.value)}
                        error={phone.length > 0 && !uzPhoneOk}
                        helperText={phone.length > 0 && !uzPhoneOk ? langData.phoneHelper : " "}
                        required
                        sx={textFieldStyles}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon sx={{ color: theme.red }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label={langData.offer}
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        multiline
                        minRows={4}
                        required
                        sx={textFieldStyles}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                    <ChatIcon sx={{ color: theme.red }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!canSubmit}
                        startIcon={<SendIcon />}
                        sx={{
                            py: 1.5,
                            mt: 2,
                            backgroundColor: theme.red,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            "&:hover": { backgroundColor: "#b20710" },
                            "&.Mui-disabled": { backgroundColor: "#555", color: "#888" }
                        }}
                    >
                        {submitting ? "..." : langData.send}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={alert.open}
                autoHideDuration={4000}
                onClose={() => setAlert((a) => ({ ...a, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setAlert((a) => ({ ...a, open: false }))}
                    severity={alert.type}
                    variant="filled"
                    sx={{ width: "100%", bgcolor: alert.type === "success" ? "#2e7d32" : theme.red }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}