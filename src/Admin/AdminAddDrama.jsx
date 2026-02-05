import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";




export default function AdminAddDrama() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        lang: "",
        genres: [],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const genreOptions = [
        "Drama",
        "Romance",
        "Comedy",
        "Action",
        "Thriller",
        "Mystery",
        "Historical",
        "Fantasy",
        "School",
        "Melodrama",
        "Family",
        "Crime",
        "Medical",
        "Sci-Fi",
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGenreToggle = (genre) => {
        setFormData((prev) => {
            const selected = new Set(prev.genres || []);
            if (selected.has(genre)) {
                selected.delete(genre);
            } else {
                selected.add(genre);
            }
            return { ...prev, genres: Array.from(selected) };
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
                lang: "",
                genres: [],
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

                    <div className="border border-gray-200 rounded-xl p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">🏷 Janrlar</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {genreOptions.map((g) => (
                                <label key={g} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.genres?.includes(g) || false}
                                        onChange={() => handleGenreToggle(g)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

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
    );
}

