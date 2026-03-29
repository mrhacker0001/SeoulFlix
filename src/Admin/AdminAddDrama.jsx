import { useState } from "react";
import { collection, addDoc, serverTimestamp, } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AdminAddDrama() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        year: "",
        lang: "",
        genres: [],
        episodeCount: "",
        duration: "",
        status: "Completed",
        ageRating: "13+"
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

    const statusOptions = ["Yakunlangan", "Davom etmoqda"];
    const ageOptions = ["13+", "16+", "18+"];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGenreToggle = (genre) => {
        setFormData((prev) => {
            const selected = new Set(prev.genres);
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
                title: formData.title,
                description: formData.description,
                thumbnail: formData.thumbnail,
                genres: formData.genres,
                year: Number(formData.year),
                lang: formData.lang,
                episodeCount: Number(formData.episodsCount),
                duration: formData.duration,
                status: formData.status,
                ageRating: formData.ageRating,

                // 🔥 OPTIMIZED COUNTERS
                totalViews: 0,
                totalLikes: 0,
                totalComments: 0,
                ratingSum: 0,
                ratingCount: 0,

                uploadDate: serverTimestamp()
            });

            setMessage("✅ Drama muvaffaqiyatli qo‘shildi!");

            setFormData({
                title: "",
                description: "",
                thumbnail: "",
                year: "",
                lang: "",
                genres: [],
                episodeCount: "",
                duration: "",
                status: "Completed",
                ageRating: "13+"
            });

        } catch (error) {
            console.error(error);
            setMessage("❌ Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

            <div className="w-full max-w-xl bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-800">

                <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
                    🎬 Yangi Drama Qo‘shish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="title"
                        placeholder="Drama nomi"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Drama tavsifi"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        required
                    />

                    <input
                        type="text"
                        name="thumbnail"
                        placeholder="Poster URL"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        required
                    />

                    <div className="grid grid-cols-2 gap-3">

                        <input
                            type="number"
                            name="year"
                            placeholder="Year"
                            value={formData.year}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />

                        <input
                            type="text"
                            name="lang"
                            placeholder="Language (kr / en / uz)"
                            value={formData.lang}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />

                        <input
                            type="number"
                            name="episodessCount"
                            placeholder="Episodes soni"
                            value={formData.episodeCount}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />

                        <input
                            type="text"
                            name="duration"
                            placeholder="Duration (60 min)"
                            value={formData.duration}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />

                    </div>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                    >
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        name="ageRating"
                        value={formData.ageRating}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                    >
                        {ageOptions.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>

                    <div className="border border-gray-700 rounded-lg p-3">

                        <p className="text-gray-300 mb-2">Genres</p>

                        <div className="grid grid-cols-2 gap-2">

                            {genreOptions.map((g) => (
                                <label key={g} className="flex items-center gap-2 text-sm text-gray-200">

                                    <input
                                        type="checkbox"
                                        checked={formData.genres.includes(g)}
                                        onChange={() => handleGenreToggle(g)}
                                    />

                                    {g}

                                </label>
                            ))}

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700"
                    >
                        {loading ? "⏳ Yuklanmoqda..." : "➕ Drama qo‘shish"}
                    </button>

                </form>

                {message && (
                    <p className="text-center mt-4 text-sm text-gray-300">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}