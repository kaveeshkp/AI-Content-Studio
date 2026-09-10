import { useState } from "react";
import { clearPrompts, clearReviews, loadPrompts, loadReviews } from "../lib/storage";

export default function History() {
    const [reviews, setReviews] = useState(() => loadReviews());
    const [prompts, setPrompts] = useState(() => loadPrompts());

    return (
        <section>
            <p className="kicker">Library</p>
            <h1>History</h1>
            <p className="lead">Saved on this browser only.</p>

            <h2>Resume reviews</h2>
            {reviews.length === 0 ? (
                <p className="note">None yet.</p>
            ) : (
                <>
                    <button type="button" className="chip" onClick={() => { clearReviews(); setReviews([]); }}>
                        Clear reviews
                    </button>
                    <ul className="history-list">
                        {reviews.map((item) => (
                            <li key={item.id} className="card">
                                <span className="meta">{new Date(item.createdAt).toLocaleString()}</span>
                                <h2>Score {item.analysis.overallScore} · ATS {item.analysis.atsScore}</h2>
                                <p>{item.analysis.verdict}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h2>Prompt kits</h2>
            {prompts.length === 0 ? (
                <p className="note">None yet.</p>
            ) : (
                <>
                    <button type="button" className="chip" onClick={() => { clearPrompts(); setPrompts([]); }}>
                        Clear prompts
                    </button>
                    <ul className="history-list">
                        {prompts.map((item) => (
                            <li key={item.id} className="card">
                                <span className="meta">{item.niche} · {item.duration}s · {item.platform}</span>
                                <h2>{item.kit.title}</h2>
                                <p>{item.brief}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}