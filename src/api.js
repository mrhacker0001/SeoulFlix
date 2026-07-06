import { getAuth } from "firebase/auth";

// MUHIM: Vercel'da Environment Variables bo'limiga
// REACT_APP_API_URL = https://<railway-backend-domeningiz>.up.railway.app
// qo'shing va qayta deploy qiling (Redeploy tugmasi bilan).
//
// Agar bu o'zgaruvchi sozlanmagan bo'lsa, quyidagi fallback ishlaydi -
// productionda bu ISHLAMAYDI, faqat lokal test uchun.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export async function apiFetch(path, options = {}) {
    const user = getAuth().currentUser;
    const token = user ? await user.getIdToken() : null;

    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
    } catch (networkErr) {
        // Backend umuman ishlamayapti yoki noto'g'ri manzilga so'rov ketdi
        throw new Error(
            `Backendga ulanib bo'lmadi (${API_URL}). Backend ishlayaptimi va REACT_APP_API_URL to'g'ri sozlanganmi tekshiring.`
        );
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
        // ba'zi javoblar bo'sh bo'lishi mumkin
    }

    if (!res.ok) {
        const err = new Error(data?.error || data?.message || "So'rovda xatolik yuz berdi");
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export { API_URL };