import { useState, type FormEvent } from "react";
import { STRATEGIST_SAMPLES } from "../data/strategist-samples";
import { mockPromptKit } from "../lib/mock-prompt";
import { savePrompt } from "../lib/storage";
import type { PromptKit } from "../lib/types-prompt";

export default function Strategist() {
    const [platform, setPlatform] = useState("instagram");
    const [duration, setDuration] = useState(10);
    const [niche, setNiche] = useState("renovation");
    const [mood, setMood] = useState("cinematic");
    const [brief, setBrief] = useState("");
    const [keep, setKeep] = useState("");
    const [note, setNote] = useState("");
    const [kit, setKit] = useState<PromptKit | null>(null);

    function loadSample(id: string) {
        const pack = STRATEGIST_SAMPLES.find((s) => s.id === id);
        if (!pack) return;
        setPlatform(pack.platform);
        setDuration(pack.duration);
        setNiche(pack.niche);
        setMood(pack.mood);
        setBrief(pack.brief);
        setKeep(pack.keep);
        setKit(null);
        setNote("Sample loaded. Generate when ready.");
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!brief.trim()) {
            setNote("Write a short brief first.");
            return;
        }
        const result = mockPromptKit({ platform, duration, niche, mood, brief, keep });
        setKit(result);
        savePrompt({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            platform,
            duration,
            niche,
            mood,
            brief,
            kit: result,
        });
        setNote("Prompt kit saved. Open History.");
    }

    async function copyText(text: string) {
        await navigator.clipboard.writeText(text);
        setNote("Copied.");
    }

    return (
        <section>
            <p className="kicker">Module 02 · local prompt kit</p>
            <h1>Prompt Strategist</h1>
            <p className="lead">
                Pick a platform and a niche. Get a 9:16 shot list and one master prompt
                you can paste into an image or video model.
            </p>

            <div className="sample-row">
                {STRATEGIST_SAMPLES.map((s) => (
                    <button key={s.id} type="button" className="chip" onClick={() => loadSample(s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>

            <form className="resume-grid" onSubmit={onSubmit}>
                <div className="stack">
                    <label className="field">
                        <span>Brief</span>
                        <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={8} />
                    </label>
                    <label className="field">
                        <span>Must keep</span>
                        <textarea value={keep} onChange={(e) => setKeep(e.target.value)} rows={4} />
                    </label>
                </div>

                <div className="stack">
                    <label className="field">
                        <span>Platform</span>
                        <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            <option value="facebook">Facebook Reels</option>
                            <option value="instagram">Instagram Reels</option>
                            <option value="youtube">YouTube Shorts</option>
                        </select>
                    </label>

                    <label className="field">
                        <span>Duration</span>
                        <select className="select" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                            <option value={6}>6 seconds</option>
                            <option value={10}>10 seconds</option>
                            <option value={15}>15 seconds</option>
                        </select>
                    </label>

                    <label className="field">
                        <span>Niche</span>
                        <select className="select" value={niche} onChange={(e) => setNiche(e.target.value)}>
                            <option value="renovation">Renovation timelapse</option>
                            <option value="fashion">Fashion lookbook</option>
                            <option value="nature">Nature / garden</option>
                        </select>
                    </label>

                    <label className="field">
                        <span>Mood</span>
                        <select className="select" value={mood} onChange={(e) => setMood(e.target.value)}>
                            <option value="cinematic">Cinematic</option>
                            <option value="cold">Cold</option>
                            <option value="golden-hour">Golden hour</option>
                        </select>
                    </label>

                    <button className="primary" type="submit">Generate prompt kit</button>
                    {note ? <p className="note">{note}</p> : null}
                </div>
            </form>

            {kit ? (
                <div className="results">
                    <h2>{kit.title}</h2>
                    <p className="lead">{kit.hookOnScreen}</p>

                    <h2>Shot list</h2>
                    <ol className="plan">
                        {kit.shotList.map((shot) => (
                            <li key={shot.second}>
                                <b>{shot.second}s</b> · {shot.camera}. {shot.action}. {shot.light}.
                            </li>
                        ))}
                    </ol>

                    <h2>Master prompt</h2>
                    <pre className="letter">{kit.masterPrompt}</pre>
                    <button type="button" className="chip" onClick={() => copyText(kit.masterPrompt)}>
                        Copy master prompt
                    </button>

                    <h2>Negative prompt</h2>
                    <pre className="letter">{kit.negativePrompt}</pre>

                    <h2>Caption</h2>
                    <p>{kit.captionDraft}</p>
                    <p className="note">{kit.hashtags.join(" ")}</p>
                    <p className="note">{kit.platformNotes}</p>
                </div>
            ) : null}
        </section>
    );
}