import {
    useState,
    useEffect
} from "react";

import {
    Box,
    Typography,
    Paper,
    Container,
    Stack,
    TextField,
    IconButton,
    Avatar,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebaseConfig";

// import { useStoreState } from "../Redux/selector";

// import locale from "../localization/locale.json";

export default function FeedbackPage() {

    // const states = useStoreState();

    // const langData = useMemo(
    //     () => locale[states.lang],
    //     [states.lang]
    // );

    const [siteCommentText, setSiteCommentText]
        = useState("");

    const [siteComments, setSiteComments]
        = useState([]);

    // REALTIME COMMENTS
    useEffect(() => {

        const q = query(
            collection(db, "site_feedbacks"),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSiteComments(comments);

        });

        return () => unsubscribe();

    }, []);

    // ADD COMMENT
    const handleAddComment = async () => {

        if (!siteCommentText.trim()) return;

        try {

            await addDoc(
                collection(db, "site_feedbacks"),
                {

                    user: "Guest",

                    text: siteCommentText,

                    date: serverTimestamp(),
                }
            );

            setSiteCommentText("");

        } catch (error) {

            console.log(error);
        }
    };

    return (
        <Container
            maxWidth="md"
            sx={{ py: 5 }}
        >

            <Paper
                elevation={10}

                sx={{

                    p: {
                        xs: 2,
                        sm: 4
                    },

                    bgcolor: "#000",

                    color: "#fff",

                    border:
                        "2px solid #e50914",

                    borderRadius: "24px",
                }}
            >

                {/* TITLE */}
                <Typography
                    variant="h4"

                    sx={{

                        fontWeight: "bold",

                        color: "#e50914",

                        mb: 4,

                        textAlign: "center",

                        fontSize: {
                            xs: "1.7rem",
                            sm: "2.5rem"
                        }
                    }}
                >
                    💬 Sayt haqida fikrlar
                </Typography>

                {/* INPUT */}
                <Stack
                    direction="row"
                    spacing={2}

                    sx={{ mb: 4 }}
                >

                    <TextField
                        fullWidth

                        placeholder="Sayt haqida fikringizni yozing..."

                        value={siteCommentText}

                        onChange={(e) =>
                            setSiteCommentText(
                                e.target.value
                            )
                        }

                        sx={{

                            "& .MuiOutlinedInput-root": {

                                color: "#fff",

                                bgcolor:
                                    "rgba(255,255,255,0.05)",

                                borderRadius: "14px",

                                "& fieldset": {
                                    borderColor:
                                        "rgba(255,255,255,0.15)"
                                },

                                "&:hover fieldset": {
                                    borderColor: "#e50914"
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#e50914"
                                }
                            }
                        }}
                    />

                    <IconButton
                        onClick={handleAddComment}

                        sx={{

                            bgcolor: "#e50914",

                            color: "#fff",

                            width: 56,
                            height: 56,

                            borderRadius: "14px",

                            "&:hover": {
                                bgcolor: "#b00610",
                            }
                        }}
                    >
                        <SendIcon />
                    </IconButton>

                </Stack>

                {/* COMMENTS */}
                <Stack spacing={2}>

                    {siteComments.map((c) => (

                        <Box
                            key={c.id}

                            sx={{

                                p: 2.5,

                                borderRadius: "16px",

                                bgcolor:
                                    "rgba(255,255,255,0.04)",

                                border:
                                    "1px solid rgba(255,255,255,0.06)",
                            }}
                        >

                            {/* HEADER */}
                            <Stack
                                direction="row"
                                spacing={2}

                                alignItems="center"

                                sx={{ mb: 1 }}
                            >

                                <Avatar
                                    sx={{

                                        bgcolor: "#e50914",

                                        width: 38,
                                        height: 38,
                                    }}
                                >
                                    {c.user?.charAt(0)
                                        ?.toUpperCase()}
                                </Avatar>

                                <Box>

                                    <Typography
                                        fontWeight="bold"
                                    >
                                        {c.user}
                                    </Typography>

                                    <Typography
                                        variant="caption"

                                        sx={{
                                            color: "gray"
                                        }}
                                    >
                                        {c.date?.seconds
                                            ? new Date(
                                                c.date.seconds * 1000
                                            ).toLocaleDateString()

                                            : "Hozir"}
                                    </Typography>

                                </Box>

                            </Stack>

                            {/* TEXT */}
                            <Typography
                                variant="body1"

                                sx={{

                                    pl: {
                                        xs: 0,
                                        sm: 7
                                    },

                                    color:
                                        "rgba(255,255,255,0.88)",

                                    lineHeight: 1.7
                                }}
                            >
                                {c.text}
                            </Typography>

                        </Box>

                    ))}

                    {!siteComments.length && (

                        <Typography
                            align="center"
                            color="gray"
                        >
                            Hozircha fikrlar yo‘q
                        </Typography>
                    )}

                </Stack>

            </Paper>

        </Container>
    );
}