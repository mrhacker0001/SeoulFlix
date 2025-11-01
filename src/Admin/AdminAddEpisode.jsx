import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import { Snackbar, Alert } from "@mui/material";

export default function AdminAddEpisode() {
    const [dramas, setDramas] = useState([]);
    const [selectedDrama, setSelectedDrama] = useState("");
    const [formData, setFormData] = useState({
        episode: "",
        season: "",
        videoId: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

    useEffect(() => {
        const fetchDramas = async () => {
            try {
                const list = await apiGet('/api/dramas');
                setDramas(list);
            } catch (e) {
                console.error(e);
            }
        };
        fetchDramas();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDrama) {
            setMessage("⚠️ Avval drama tanlang!");
            setToast({ open: true, msg: "Dramani tanlang", type: "warning" });
            return;
        }

        if (!formData.episode.trim() || !formData.videoId.trim()) {
            setToast({ open: true, msg: "Epizod va video ID majburiy", type: "warning" });
            return;
        }
        if (isNaN(Number(formData.episode))) {
            setToast({ open: true, msg: "Epizod raqami son bo'lishi kerak", type: "warning" });
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await apiPost(`/api/dramas/${selectedDrama}/episodes`, formData);
            setMessage("✅ Epizod muvaffaqiyatli qo‘shildi!");
            setToast({ open: true, msg: "Epizod qo'shildi", type: "success" });
            setFormData({
                episode: "",
                season: "",
                videoId: "",
            });
        } catch (error) {
            console.error("Xato:", error);
            setMessage("❌ Xatolik yuz berdi!");
            setToast({ open: true, msg: "Xatolik yuz berdi", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
                    🎬 Drama Epizodi Qo‘shish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={selectedDrama}
                        onChange={(e) => setSelectedDrama(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                    >
                        <option value="">🎞 Dramani tanlang</option>
                        {dramas.map((drama) => (
                            <option key={drama.id} value={drama.id}>
                                {drama.title}
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="season"
                            placeholder="📅 Mavsum"
                            value={formData.season}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                        <input
                            type="text"
                            name="episode"
                            placeholder="🎥 Epizod raqami"
                            value={formData.episode}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                            required
                        />
                    </div>

                    <input
                        type="text"
                        name="videoId"
                        placeholder="📺 YouTube Video ID"
                        value={formData.videoId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 active:scale-95"
                    >
                        {loading ? "⏳ Yuklanmoqda..." : "➕ Epizod qo‘shish"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-5 text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
        <Snackbar
            open={toast.open}
            autoHideDuration={3000}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert severity={toast.type} sx={{ width: '100%' }}>
                {toast.msg}
            </Alert>
        </Snackbar>
        </>
    );
}
