import { useState, type FormEvent } from "react";
import { CAMPAIGN_SAMPLES } from "../data/campaign-samples";
import { mockCampaign } from "../lib/mock-campaign";
import { saveCampaign } from "../lib/storage";
import type { CampaignKit } from "../lib/types-campaign";

const ALL = ["facebook", "instagram", "youtube"] as const;

export default function Campaign() {
    const [topic, setTopic] = useState("");
    const [audience, setAudience] = useState("");
    const [language, setLanguage] = useState<"en" | "mix">("en");
    const [platforms, setPlatforms] = useState<string[]>(["facebook", "instagram", "youtube"]);
    const [note, setNote] = useState("");
    const [kit, setKit] = useState<CampaignKit | null>(null);

    function loadSample(id: string) {
        const pack = CAMPAIGN_SAMPLES.find((s) => s.id === id);
        if (!pack) return;
        setTopic(pack.topic);
        setAudience(pack.audience);
        setLanguage(pack.language);
        setPlatforms([...pack.platforms]);
        setKit(null);
        setNote("Sample loaded.");
    }

    function toggle(id: string) {
        setPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!topic.trim()) {
            setNote("Write a topic first.");
            return;
        }
        const result = mockCampaign({
            topic,
            audience,
            language,
            platforms: platforms as Array<"facebook" | "instagram" | "youtube">,
        });
        setKit(result);
        saveCampaign({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            topic,
            audience,
            language,
            kit: result,
        });
        setNote("Campaign saved. Open History.");
    }

    return (
        <section>
            <p className="kicker">Module 03 · copy only, no posting</p>
            <h1>Campaign Planner</h1>
            <p className="lead">
                One topic, three different captions. This does not publish to Facebook,
                Instagram, or YouTube.
            </p>

            <div className="sample-row">
                {CAMPAIGN_SAMPLES.map((s) => (
                    <button key={s.id} type="button" className="chip" onClick={() => loadSample(s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>

            <form className="resume-grid" onSubmit={onSubmit}>
                <div className="stack">
                    <label className="field">
                        <span>Topic or draft caption</span>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={7} />
                    </label>
                    <label className="field">
                        <span>Audience</span>
                        <textarea value={audience} onChange={(e) => setAudience(e.target.value)} rows={4} />
                    </label>
                </div>

                <div className="stack">
                    <label className="field">
                        <span>Language</span>
                        <select className="select" value={language} onChange={(e) => setLanguage(e.target.value as "en" | "mix")}>
                            <option value="en">English</option>
                            <option value="mix">Sinhala + English mix</option>
                        </select>
                    </label>

                    <div className="field">
                        <span>Platforms</span>
                        {ALL.map((id) => (
                            <label key={id} className="check">
                                <input
                                    type="checkbox"
                                    checked={platforms.includes(id)}
                                    onChange={() => toggle(id)}
                                />
                                {id}
                            </label>
                        ))}
                    </div>

                    <button className="primary" type="submit">Build campaign kit</button>
                    {note ? <p className="note">{note}</p> : null}
                </div>
            </form>

            {kit ? (
                <div className="results">
                    <p className="note">Suggested length: {kit.recommendedLengthSeconds}s</p>
                    <h2>When to post</h2>
                    <ul className="plan">
                        {kit.postingWindows.map((w) => (
                            <li key={w.label}><b>{w.label}</b> — {w.reason}</li>
                        ))}
                    </ul>

                    <h2>Checklist</h2>
                    <ol className="plan">
                        {kit.checklist.map((c) => <li key={c}>{c}</li>)}
                    </ol>

                    <h2>Thumbnail prompt</h2>
                    <pre className="letter">{kit.thumbnailPrompt}</pre>

                    {kit.packs.map((p) => (
                        <div key={p.platform} className="bullet-card">
                            <p className="meta">{p.platform}</p>
                            <h2>{p.title}</h2>
                            <p><b>Hook:</b> {p.hook}</p>
                            <p>{p.caption}</p>
                            <p className="note">{p.hashtags.join(" ")}</p>
                            <p className="note">{p.extra}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </section>
    );
}