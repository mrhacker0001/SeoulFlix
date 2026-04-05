import { Box, Typography } from "@mui/material";

export default function MaintenanceNotice() {
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
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                Sayt Yopildi
            </Typography>
            {/* <Typography variant="h6" sx={{ mb: 4, color: "gray" }}>
                Biz 3 kun davomida saytda yangilanishlar olib boramiz. Iltimos, keyinroq qayta keling.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Sizga noqulaylik uchun uzr so'raymiz. 🙏
            </Typography>
            <Button
                variant="contained"
                sx={{
                    bgcolor: "#e50914",
                    "&:hover": { bgcolor: "#b00610" },
                    borderRadius: "30px",
                    px: 4,
                }}
                onClick={() => window.location.reload()}
            >
                Saytni Tekshirish
            </Button> */}
        </Box>
    );
}