import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    Divider,
    Chip,
    Container
} from "@mui/material";
import localDonations from "./donations.json"; // JSON faylingiz
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function DonationsPage() {
    const [donations] = useState(localDonations);
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);

    // Hisob-kitoblar
    const total = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    // const top = [...donations].sort((a, b) => b.amount - a.amount)[0];

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={10} sx={{
                p: 3,
                bgcolor: "#000", // Qora fon
                color: "#fff",
                border: "2px solid #ff0000", // Qizil chegara
                borderRadius: 4
            }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#ff0000" }}>
                    🎉 {langData.donations}
                </Typography>

                {/* Donatlar ro'yxati (Scroll bilan) */}
                <List sx={{
                    maxHeight: 400,
                    overflow: "auto",
                    mb: 3,
                    "&::-webkit-scrollbar": { width: "5px" },
                    "&::-webkit-scrollbar-thumb": { background: "#ff0000" }
                }}>
                    {donations.map((d, i) => (
                        <Box key={i}>
                            <ListItem sx={{ flexDirection: "column", alignItems: "flex-start", py: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 1 }}>
                                    <Typography variant="h6" sx={{ color: "#fff" }}>{d.name}</Typography>
                                    <Typography variant="h6" sx={{ color: "#ff0000", fontWeight: "bold" }}>
                                        {d.amount.toLocaleString()} so'm
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                                    {d.message}
                                </Typography>

                                <Typography variant="caption" sx={{ color: "#666", alignSelf: "flex-end" }}>
                                    📅 {d.date}
                                </Typography>
                            </ListItem>
                            {i !== donations.length - 1 && <Divider sx={{ bgcolor: "#333" }} />}
                        </Box>
                    ))}
                </List>

                {/* Statistika qismi */}
                <Box sx={{ p: 2, bgcolor: "#1a1a1a", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography>{langData.total}:</Typography>
                        <Typography sx={{ color: "#ff0000", fontWeight: "bold" }}>
                            {total.toLocaleString()} so'm
                        </Typography>
                    </Box>

                    {/* {top && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography>🥇 Top Donor:</Typography>
                            <Chip
                                label={top.name}
                                size="small"
                                sx={{ bgcolor: "#ff0000", color: "#fff", fontWeight: "bold" }}
                            />
                        </Box>
                    )} */}
                </Box>
            </Paper>
        </Container>
    );
}