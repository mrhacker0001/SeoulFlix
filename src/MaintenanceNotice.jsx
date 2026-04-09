import { Box, Typography, Button } from "@mui/material";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setDeadline } from "./Redux/maintenanceSlice";

export default function MaintenanceNotice() {
    const dispatch = useDispatch();
    const deadline = useSelector((state) => state.maintenance.deadline);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let savedDeadline = localStorage.getItem("deadline");

        if (savedDeadline) {
            dispatch(setDeadline(Number(savedDeadline)));
        } else {
            const newDeadline = Date.now() + 45 * 24 * 60 * 60 * 1000;
            localStorage.setItem("deadline", newDeadline);
            dispatch(setDeadline(newDeadline));
        }

        setReady(true);
    }, [dispatch]);

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <Typography variant="h5" color="green" sx={{ mt: 3 }}>
                    Sayt yana ishga tushdi 🎉
                </Typography>
            );
        }

        const items = [
            { label: "Kun", value: days },
            { label: "Soat", value: hours },
            { label: "Minut", value: minutes },
            { label: "Sekund", value: seconds },
        ];

        return (
            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    mt: 4,
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {items.map((item, i) => (
                    <Box
                        key={i}
                        sx={{
                            bgcolor: "#1a1a1a",
                            px: 4,
                            py: 3,
                            borderRadius: "16px",
                            minWidth: "90px",
                            textAlign: "center",
                            boxShadow: "0 0 20px rgba(229,9,20,0.3)",
                        }}
                    >
                        <Typography variant="h3" fontWeight="bold">
                            {String(item.value).padStart(2, "0")}
                        </Typography>
                        <Typography variant="caption" color="gray">
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    if (!ready || !deadline) return null;

    return (
        <Box
            sx={{
                bgcolor: "#0b0b0b",
                color: "#fff",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
            }}
        >
            <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                    mb: 2,
                    background: "linear-gradient(90deg, #e50914, #ff4d4d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Sayt vaqtincha yopildi
            </Typography>

            <Typography
                variant="h6"
                sx={{ mb: 2, color: "gray", maxWidth: 500 }}
            >
                Texnik nosozlik sababli sayt 45 kun davomida yopildi.
                Hozirda tizim yangilanmoqda va yaxshilanmoqda.
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
                Qayta ochilishigacha qolgan vaqt:
            </Typography>

            <Countdown date={deadline} renderer={renderer} />

            <Button
                variant="contained"
                sx={{
                    mt: 6,
                    bgcolor: "#e50914",
                    "&:hover": { bgcolor: "#b00610" },
                    borderRadius: "30px",
                    px: 5,
                    py: 1.5,
                    fontWeight: "bold",
                }}
                onClick={() => window.location.reload()}
            >
                Qayta tekshirish
            </Button>
        </Box>
    );
}