import { useState } from "react";
import { clearReviews, loadReviews } from "../lib/storage";

export default function History() {
    const [items, setItems] = useState(() => loadReviews());

    function onClear() {
        clearReviews();
        setItems([]);
    }

    return (
        <section>
            <p className="kicker">Library</p>
            <h1>History</h1>
            <p className="lead">Reviews stay in this browser only. Sign-in comes later.</p>

            {items.length === 0 ? (
                <div className="placeholder">
                    <span className="badge">Empty</span>
                    <h2>No runs yet</h2>
                    <p>Run a local review on the Resume page. It will land here.</p>
                </div>
            ) : (
                <>
                    <button type="button" className="chip" onClick={onClear}>Clear all</button>
                    <ul className="history-list">
                        {items.map((item) => (
                            <li key={item.id} className="card">
                                <span className="meta">{new Date(item.createdAt).toLocaleString()}</span>
                                <h2>Score {item.analysis.overallScore} · ATS {item.analysis.atsScore}</h2>
                                <p>{item.analysis.verdict}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}