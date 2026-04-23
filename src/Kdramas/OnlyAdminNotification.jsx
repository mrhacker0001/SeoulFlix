import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function OnlyAdminNotification() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const sendNotification = async () => {
        if (!title || !desc) return;

        await addDoc(collection(db, "notifications"), {
            title,
            desc,
            createdAt: serverTimestamp(),
            read: false
        });

        setTitle("");
        setDesc("");
        alert("Yuborildi 🚀");
    };

    return (
        <Box sx={{ p: 3 }}>
            <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={sendNotification}>
                Send Notification
            </Button>
        </Box>
    );
}