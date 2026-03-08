
import { useMemo } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Container
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useStoreState } from "../Redux/selector";
import locale from "../localization/locale.json";

export default function HelpPage() {
    const states = useStoreState();
    const langData = useMemo(() => locale[states.lang], [states.lang]);
    const faqs = langData.faqs;

    const themeColors = {
        primaryRed: "#E50914",
        darkBg: "#000000",
        paperBg: "#141414",    
        textWhite: "#ffffff",
        textGray: "#b3b3b3"
    };

    return (
        <Box sx={{
            backgroundColor: themeColors.darkBg,
            minHeight: "100vh",
            py: 8,
            color: themeColors.textWhite
        }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <HelpOutlineIcon sx={{ fontSize: 48, color: themeColors.primaryRed, mb: 2 }} />
                    <Typography
                        variant="h3"
                        fontWeight="900"
                        gutterBottom
                        sx={{ textTransform: 'uppercase', letterSpacing: 2 }}
                    >
                        {langData.helpCenter}
                    </Typography>
                    <Typography sx={{ color: themeColors.textGray, fontSize: "1.1rem" }}>
                        {langData.helpSubtitle}
                    </Typography>
                </Box>

                {faqs.map((item, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            mb: 2,
                            backgroundColor: themeColors.paperBg,
                            color: themeColors.textWhite,
                            borderRadius: "8px !important",
                            border: "1px solid #333",
                            '&:before': { display: 'none' }, 
                            '&.Mui-expanded': {
                                border: `1px solid ${themeColors.primaryRed}`,
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: themeColors.primaryRed }} />}
                            sx={{ px: 3 }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                                {item.question}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 3, pb: 3, borderTop: "1px solid #333" }}>
                            <Typography sx={{ color: themeColors.textGray, lineHeight: 1.7 }}>
                                {item.answer}

                                {item.link && (
                                    <Box sx={{ mt: 2 }}>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: themeColors.primaryRed,
                                                fontWeight: "bold",
                                                textDecoration: "none",
                                                borderBottom: `1px solid ${themeColors.primaryRed}`,
                                                paddingBottom: "2px",
                                                transition: "0.3s"
                                            }}
                                            onMouseOver={(e) => e.target.style.opacity = "0.7"}
                                            onMouseOut={(e) => e.target.style.opacity = "1"}
                                        >
                                            tirikchilik.uz/seoulflix
                                        </a>
                                    </Box>
                                )}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Box>
    );
}