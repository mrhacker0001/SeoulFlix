// src/pages/HelpPage.jsx
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function HelpPage() {
    const faqs = [
        {
            question: "SeoulFlix nima?",
            answer:
                "SeoulFlix — bu siz sevadigan koreys dramalarini tomosha qilish, ularga like bosish va fikr bildirish imkonini beruvchi platforma.",
        },
        {
            question: "Qanday qilib tizimga kiraman yoki ro‘yxatdan o‘taman?",
            answer:
                "Sahifaning yuqori o‘ng burchagidagi 'Kirish' yoki 'Ro‘yxatdan o‘tish' tugmalaridan foydalaning. Siz Google yoki email orqali hisob yaratishingiz mumkin.",
        },
        {
            question: "Dramalarga qanday qilib like bosaman?",
            answer:
                "Video sahifasida yurak belgisi (❤️) mavjud. Unga bir marta bosish orqali sizga yoqqan dramaga like bera olasiz. Yana bosganingizda like olib tashlanadi.",
        },
        {
            question: "Fikr (komment) qoldirish uchun nima qilish kerak?",
            answer:
                "Komment yozish uchun siz tizimga kirgan bo‘lishingiz kerak. Keyin video ostidagi matn maydoniga yozib, 'Yuborish' tugmasini bosing.",
        },
        {
            question: "Boshqa foydalanuvchilar kommentlarimni ko‘ra oladimi?",
            answer:
                "Ha, barcha foydalanuvchilar sizning kommentingizni real vaqt rejimida ko‘rishlari mumkin.",
        },
        {
            question: "Qanday qilib qo‘llab-quvvatlash xizmatiga murojaat qilaman?",
            answer:
                "Agar sizda muammo bo‘lsa, bizga Telegram orqali @seoulflix_admin bilan bog‘laning Yoki +998 87 355 0024 raqamiga aloqaga chiqing",
        },
        {
            question: "Qanday qilib saytni qo'llab-quvvatlasak bo'ladi?",
            answer: (
                <>
                    Bizni <strong>donat</strong> orqali qo‘llab-quvvatlashingiz mumkin 🙌.
                    Buning uchun quyidagi havolaga o‘ting:{" "}
                    <a
                        href="https://tirikchilik.uz/youraccount" // 👉 bu yerga sizning haqiqiy Tirikchilik sahifangiz linkini yozing
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}
                    >
                        tirikchilik.uz/seoulflix
                    </a>
                    
                    Sizning yordamlaringiz bizga platformani yanada yaxshilashga yordam beradi 💖
                </>
            ),
        }

    ];

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, px: 2 }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                gutterBottom
            >
                🆘 Yordam markazi
            </Typography>
            <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                mb={3}
            >
                Quyidagi savollar orqali saytdan foydalanishni o‘rganing 👇
            </Typography>

            {faqs.map((item, index) => (
                <Accordion key={index} sx={{ mb: 1.5, borderRadius: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography color="text.secondary">{item.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
