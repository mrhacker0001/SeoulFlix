import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

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

    useEffect(() => {
        const fetchDramas = async () => {
            const q = query(collection(db, "dramas"), orderBy("uploadDate", "desc"));
            const querySnapshot = await getDocs(q);
            setDramas(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
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
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await addDoc(collection(db, `dramas/${selectedDrama}/episodes`), {
                ...formData,
                uploadDate: serverTimestamp(),
            });
            setMessage("✅ Epizod muvaffaqiyatli qo‘shildi!");
            setFormData({
                episode: "",
                season: "",
                videoId: "",
            });
        } catch (error) {
            console.error("Xato:", error);
            setMessage("❌ Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
}
