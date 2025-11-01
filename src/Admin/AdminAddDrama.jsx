import { useState } from "react";
import { apiPost } from "../api";
import { Snackbar, Alert } from "@mui/material";

export default function AdminAddDrama() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        lang: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // basic validation
            if (!formData.title.trim() || !formData.description.trim() || !formData.thumbnail.trim()) {
                throw new Error("Maydonlar to'liq to'ldirilishi kerak");
            }
            const urlOk = /^(https?:\/\/).+/.test(formData.thumbnail.trim());
            if (!urlOk) throw new Error("Rasm URL noto'g'ri formatda");

            await apiPost('/api/dramas', formData);
            setMessage("✅ Drama muvaffaqiyatli qo‘shildi!");
            setToast({ open: true, msg: "Drama qo'shildi", type: "success" });
            setFormData({
                title: "",
                description: "",
                thumbnail: "",
                lang: "",
            });
        } catch (error) {
            console.error("Xato:", error);
            setMessage("❌ Xatolik yuz berdi!");
            setToast({ open: true, msg: error.message || "Xatolik yuz berdi", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
                    🎞 Yangi Drama Qo‘shish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="🎬 Drama nomi"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="📝 Tavsif"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        required
                        rows={3}
                    ></textarea>
                    <input
                        type="text"
                        name="thumbnail"
                        placeholder="🖼 Rasm (URL)"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        required
                    />
                    <input
                        type="text"
                        name="lang"
                        placeholder="🌐 Til (uz / en / kr)"
                        value={formData.lang}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-lg font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 active:scale-95"
                    >
                        {loading ? "⏳ Yuklanmoqda..." : "➕ Qo‘shish"}
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

