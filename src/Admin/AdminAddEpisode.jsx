import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { apiFetch } from "../api";

export default function AdminAddEpisode() {
    const [dramas, setDramas] = useState([]);
    const [selectedDrama, setSelectedDrama] = useState("");
    const [mode, setMode] = useState("bunnyId"); // "bunnyId" | "sourceUrl"
    const [formData, setFormData] = useState({
        episode: "",
        season: "",
        sourceUrl: "",
        bunnyVideoId: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [processingStatus, setProcessingStatus] = useState(null);

    useEffect(() => {
        const fetchDramas = async () => {
            const q = query(
                collection(db, "dramas"),
                orderBy("uploadDate", "desc"),
                limit(20)
            );
            const querySnapshot = await getDocs(q);
            setDramas(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
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

        if (mode === "bunnyId" && !formData.bunnyVideoId.trim()) {
            setMessage("⚠️ Bunny Video ID kiriting!");
            return;
        }
        if (mode === "sourceUrl" && !formData.sourceUrl.trim()) {
            setMessage("⚠️ Video linkini kiriting!");
            return;
        }

        setLoading(true);
        setMessage("");
        setProcessingStatus(null);

        try {
            const body = {
                episode: formData.episode,
                season: formData.season || 1,
                ...(mode === "bunnyId"
                    ? { bunnyVideoId: formData.bunnyVideoId.trim() }
                    : { sourceUrl: formData.sourceUrl.trim() }),
            };

            const result = await apiFetch(`/api/admin/dramas/${selectedDrama}/episodes`, {
                method: "POST",
                body: JSON.stringify(body),
            });

            setProcessingStatus(result.status);

            if (result.status === "ready") {
                setMessage("✅ Epizod qo'shildi va video tayyor - hoziroq ko'rsatish mumkin!");
            } else {
                setMessage("✅ Epizod qo'shildi! Video Bunny'da qayta ishlanmoqda...");

                const dramaId = selectedDrama;
                const episodeId = result.id;
                const poll = setInterval(async () => {
                    try {
                        const status = await apiFetch(
                            `/api/admin/dramas/${dramaId}/episodes/${episodeId}/status`
                        );
                        setProcessingStatus(status.status);
                        if (status.status === "ready" || status.status === "error") {
                            clearInterval(poll);
                            setMessage(
                                status.status === "ready"
                                    ? "✅ Video tayyor! Endi saytda ko'rish mumkin."
                                    : "❌ Video qayta ishlashda xato yuz berdi."
                            );
                        }
                    } catch (e) {
                        clearInterval(poll);
                    }
                }, 5000);
            }

            setFormData({ episode: "", season: "", sourceUrl: "", bunnyVideoId: "" });
        } catch (error) {
            console.error("Xato:", error);
            setMessage(`❌ ${error.message || "Xatolik yuz berdi!"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
                    🎬 Drama Epizodi Qo'shish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={selectedDrama}
                        onChange={(e) => setSelectedDrama(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl"
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
                            type="number"
                            name="season"
                            placeholder="📅 Mavsum"
                            value={formData.season}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl"
                        />
                        <input
                            type="number"
                            name="episode"
                            placeholder="🎥 Epizod raqami"
                            value={formData.episode}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-xl"
                            required
                        />
                    </div>

                    {/* Rejim tanlash */}
                    <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => setMode("bunnyId")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "bunnyId" ? "bg-blue-600 text-white" : "text-gray-600"
                                }`}
                        >
                            Bunny'ga qo'lda yukladim
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("sourceUrl")}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === "sourceUrl" ? "bg-blue-600 text-white" : "text-gray-600"
                                }`}
                        >
                            Linkdan avtomatik import
                        </button>
                    </div>

                    {mode === "bunnyId" ? (
                        <>
                            <input
                                type="text"
                                name="bunnyVideoId"
                                placeholder="🐰 Bunny Video ID (GUID)"
                                value={formData.bunnyVideoId}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <p className="text-xs text-gray-500 -mt-2 px-1">
                                Bunny dashboard → kutubxonangiz → videoni oching → ustidagi ID'ni (GUID) shu yerga joylashtiring.
                            </p>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="sourceUrl"
                                placeholder="📺 Video linki (ochiq/public URL)"
                                value={formData.sourceUrl}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl"
                                required
                            />
                            <p className="text-xs text-gray-500 -mt-2 px-1">
                                Masalan hozirgi DigitalOcean video linki - Bunny uni o'zi import qilib, HD sifatlarga o'giradi.
                            </p>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white"
                    >
                        {loading ? "⏳ Yuklanmoqda..." : "➕ Epizod qo'shish"}
                    </button>
                </form>

                {message && (
                    <p className="text-center mt-5 text-sm font-medium">
                        {message}
                    </p>
                )}

                {processingStatus && processingStatus !== "ready" && processingStatus !== "error" && (
                    <p className="text-center mt-2 text-xs text-blue-600 animate-pulse">
                        ⏳ Bunny holati: {processingStatus}...
                    </p>
                )}
            </div>
        </div>
    );
}