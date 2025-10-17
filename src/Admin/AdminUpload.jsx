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
        <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">🎬 Yangi Drama Qo‘shish</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Drama nomi"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Tavsif"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                    required
                ></textarea>
                <input
                    type="text"
                    name="thumbnail"
                    placeholder="Rasm (URL)"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="videoId"
                    placeholder="YouTube video ID (masalan: dQw4w9WgXcQ)"
                    value={formData.videoId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                    required
                />
                <input
                    type="text"
                    name="season"
                    placeholder="Mavsum"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                />
                <input
                    type="text"
                    name="episode"
                    placeholder="Epizod"
                    value={formData.episode}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                />
                <input
                    type="text"
                    name="lang"
                    placeholder="Language"
                    value={formData.lang}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? "Yuklanmoqda..." : "Qo‘shish"}
                </button>
            </form>

            {message && <p className="text-center mt-3">{message}</p>}
        </div>
    );
}
