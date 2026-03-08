import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Typography } from "@mui/material";


export default function AdminDashboard() {
    const [dramas, setDramas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDramas = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "dramas"));
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDramas(docs);
        } catch (error) {
            console.error("Xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDramas();
    }, []);

    const markAsCompleted = async (id) => {
        try {
            const dramaRef = doc(db, "dramas", id);
            await updateDoc(dramaRef, { status: "Yakunlangan" });
            alert("Status yangilandi!");
            fetchDramas(); 
        } catch (error) {
            alert("Xatolik yuz berdi");
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Yuklanmoqda...</div>;

    return (
        <div className="min-h-screen bg-black p-6 text-white">
            <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">🎬 Drama Boshqaruvi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dramas.map((drama) => (
                    <div key={drama.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <img src={drama.thumbnail} alt="" className="w-20 h-28 object-cover rounded-md" />
                            <Box>
                                <Typography variant="h6" className="text-white">{drama.title}</Typography>
                                <Typography variant="body2" className="text-gray-400">Status: {drama.status}</Typography>
                            </Box>
                        </Box>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {drama.status !== "Yakunlangan" && (
                                <button
                                    onClick={() => markAsCompleted(drama.id)}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition"
                                >
                                    ✅ Yakunlash
                                </button>
                            )}
                            <button
                                onClick={async () => {
                                    if (window.confirm("O'chirilsinmi?")) {
                                        await deleteDoc(doc(db, "dramas", drama.id));
                                        fetchDramas();
                                    }
                                }}
                                className="px-4 py-2 bg-gray-700 hover:bg-red-900 rounded-lg transition"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}