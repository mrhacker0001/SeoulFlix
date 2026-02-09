// src/pages/HelpPage.jsx
import { useMemo } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function HelpPage() {
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    const faqs = langData.faqs;


    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, px: 2 }}>
            <Typography variant="h4">
                {langData.helpCenter}
            </Typography>

            <Typography>
                {langData.helpSubtitle}
            </Typography>


            {faqs.map((item, index) => (
                <Accordion key={index} sx={{ mb: 1.5, borderRadius: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">
                            {item.question}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography color="text.secondary">
                            {item.answer}

                            {item.link && (
                                <>
                                    <br />
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: "#1976d2",
                                            fontWeight: "bold",
                                            textDecoration: "none"
                                        }}
                                    >
                                        tirikchilik.uz/seoulflix
                                    </a>
                                </>
                            )}
                        </Typography>
                    </AccordionDetails>

                </Accordion>
            ))}

        </Box>
    );
}
