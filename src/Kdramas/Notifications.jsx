import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    Avatar,
    Divider,
    IconButton,
    Button
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import {
    collection,
    onSnapshot,
    updateDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // o'zingdagi config

// ⏱ vaqtni format qilish
function timeAgo(timestamp) {
    if (!timestamp) return "";
    const now = new Date();
    const time = timestamp.toDate();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} d ago`;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    // 🔄 REALTIME FIREBASE
    useEffect(() => {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotifications(data);
        });

        return () => unsubscribe();
    }, []);

    // ✅ single read
    const markAsRead = async (id) => {
        await updateDoc(doc(db, "notifications", id), {
            read: true
        });
    };

    // ✅ mark all
    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(
            unread.map(n =>
                updateDoc(doc(db, "notifications", n.id), { read: true })
            )
        );
    };

    return (
        <Box sx={{ p: 2, color: "#fff", minHeight: "100vh", bgcolor: "#0b0b0b" }}>

            {/* HEADER */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    🔔 Notifications
                </Typography>

                <Button
                    size="small"
                    startIcon={<DoneAllIcon />}
                    onClick={markAllAsRead}
                    sx={{ color: "#e50914" }}
                >
                    Read all
                </Button>
            </Box>

            {/* EMPTY STATE */}
            {notifications.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 10, opacity: 0.6 }}>
                    <NotificationsIcon sx={{ fontSize: 50, mb: 1 }} />
                    <Typography>No notifications yet</Typography>
                </Box>
            )}

            {/* LIST */}
            <List>
                {notifications.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            sx={{
                                bgcolor: item.read ? "transparent" : "rgba(229,9,20,0.08)",
                                borderRadius: "12px",
                                mb: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                transition: "0.2s",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.05)"
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: "#e50914" }}>
                                    <NotificationsIcon />
                                </Avatar>

                                <Box>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                                        {item.title}
                                    </Typography>

                                    <Typography sx={{ fontSize: "0.75rem", color: "#aaa" }}>
                                        {item.desc}
                                    </Typography>

                                    <Typography sx={{ fontSize: "0.7rem", color: "#666" }}>
                                        {timeAgo(item.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            {!item.read && (
                                <IconButton onClick={() => markAsRead(item.id)}>
                                    <CheckCircleIcon sx={{ color: "#e50914" }} />
                                </IconButton>
                            )}
                        </ListItem>

                        <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}