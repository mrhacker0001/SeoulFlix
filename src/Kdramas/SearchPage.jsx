import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
    Container,
    TextField,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
} from "@mui/material";



export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [dramas, setDramas] = useState([]);


    const filtered = dramas.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "dramas"));
            setDramas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <TextField
                fullWidth
                label="Dramani qidiring..."
                variant="outlined"
                sx={{ mb: 4 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Grid container spacing={3}>
                {filtered.map((drama) => (
                    <Grid item xs={12} sm={6} md={4} key={drama.id}>
                        <Card sx={{ bgcolor: "background.paper" }}>
                            <CardMedia component="img" height="200" image={drama.thumbnail} />
                            <CardContent>
                                <Typography variant="h6">{drama.title}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
