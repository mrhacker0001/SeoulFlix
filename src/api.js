import { getAuth } from "firebase/auth";

// .env faylingizga qo'shing:
//   REACT_APP_API_URL=http://localhost:5000        (lokal test uchun)
//   REACT_APP_API_URL=https://api.seoulflix.org     (production, Railway domeningiz)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Backendga so'rov yuboradi va joriy Firebase foydalanuvchisining ID tokenini
 * avtomatik qo'shib beradi. Login qilinmagan bo'lsa token'siz yuboradi
 * (masalan hech qanday himoyalanmagan endpoint uchun).
 */
export async function apiFetch(path, options = {}) {
    const user = getAuth().currentUser;
    const token = user ? await user.getIdToken() : null;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

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
