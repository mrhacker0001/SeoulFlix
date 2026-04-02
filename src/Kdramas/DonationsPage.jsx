import { useEffect, useState } from "react";

export default function DonationsPage() {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        fetch("https://tirikchilik.uz/widgets/statistics/?token=29bd56a9409b4fa796f0909cc70da27e")
            .then(res => res.json())
            .then(data => {
                setDonations(data.donations || []);
            });
    }, []);
    const top = donations.sort((a, b) => b.amount - a.amount)[0];
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    return (
        <div style={{ padding: "20px" }}>
            <h2>🎉 Donatlar</h2>

            {donations.map((d, i) => (
                <div key={i} style={{
                    padding: "10px",
                    marginBottom: "10px",
                    background: "#111",
                    color: "#fff",
                    borderRadius: "10px"
                }}>
                    <b>{d.name}</b> — {d.amount} so'm
                    <br />
                    <small>{d.message}</small>
                </div>
            ))}
            <h3>💰 Jami: {total} so'm</h3>
            <h4>🥇 Top donor: {top?.name}</h4>
        </div>
    );
}