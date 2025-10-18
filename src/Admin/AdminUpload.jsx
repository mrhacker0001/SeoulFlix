import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AdminUpload() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        videoId: "",
        season: "",
        episode: "",
        lang: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
            await addDoc(collection(db, "dramas"), {
                ...formData,
                uploadDate: serverTimestamp(),
            });
            setMessage("✅ Drama muvaffaqiyatli qo‘shildi!");
            setFormData({
                title: "",
                description: "",
                thumbnail: "",
                videoId: "",
                season: "",
                episode: "",
                lang: "",
            });
        } catch (error) {
            console.error("Xato:", error);
            setMessage("❌ Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
                    🎬 Yangi Drama Qo‘shish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="🎞 Drama nomi"
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
                        name="videoId"
                        placeholder="🎥 YouTube video ID (masalan: dQw4w9WgXcQ)"
                        value={formData.videoId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="season"
                            placeholder="📅 Mavsum"
                            value={formData.season}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        />
                        <input
                            type="text"
                            name="episode"
                            placeholder="🎬 Epizod"
                            value={formData.episode}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        />
                    </div>
                    <input
                        type="text"
                        name="lang"
                        placeholder="🌐 Til (masalan: uz / en / kr)"
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
                        className={`text-center mt-5 text-sm font-medium ${message.startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
