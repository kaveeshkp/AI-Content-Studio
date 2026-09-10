import { useMemo, useState, type FormEvent } from "react";
import { RESUME_SAMPLES } from "../data/samples";
import { atsScore, inspectResume } from "../lib/ats";
import { mockReview } from "../lib/mock-review";
import { saveReview } from "../lib/storage";
import type { Analysis } from "../lib/types";

export default function Resume() {
    const [resume, setResume] = useState("");
    const [job, setJob] = useState("");
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [source, setSource] = useState("");
    const [analysis, setAnalysis] = useState<Analysis | null>(null);

    const checks = useMemo(() => inspectResume(resume), [resume]);
    const score = atsScore(checks);

    function loadSample(id: string) {
        const pack = RESUME_SAMPLES.find((s) => s.id === id);
        if (!pack) return;
        setResume(pack.resume);
        setJob(pack.job);
        setAnalysis(null);
        setSource("");
        setNote("Sample loaded. Run review when ready.");
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!resume.trim() || !job.trim()) {
            setNote("Paste both a resume and a job description first.");
            return;
        }

        setBusy(true);
        setNote("Running review…");

        let result: Analysis;
        let used = "mock";

        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume, job }),
            });
            const data = await res.json();
            if (res.ok && data.analysis) {
                result = data.analysis;
                used = "model";
            } else {
                result = mockReview(resume, job);
                used = "mock";
                setNote(data.message || "No API key. Used local review.");
            }
        } catch {
            result = mockReview(resume, job);
            used = "mock";
            setNote("Server not running. Used local review. Start npm run server.");
        }

        setAnalysis(result);
        setSource(used);
        saveReview({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            resume,
            job,
            analysis: result,
        });
        if (used === "model") setNote("Model review saved. Open History.");
        setBusy(false);
    }

    return (
        <section>
            <p className="kicker">Module 01 · {source || "ready"}</p>
            <h1>Resume Reviewer</h1>
            <p className="lead">
                Same form as yesterday. The button now asks the local server first.
                If there is no key, you still get a local review.
            </p>

            <div className="sample-row">
                {RESUME_SAMPLES.map((s) => (
                    <button key={s.id} type="button" className="chip" onClick={() => loadSample(s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>

            <form className="resume-grid" onSubmit={onSubmit}>
                <label className="field">
                    <span>Resume text</span>
                    <textarea
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        rows={18}
                    />
                </label>

                <div className="stack">
                    <label className="field">
                        <span>Job description</span>
                        <textarea
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            rows={8}
                        />
                    </label>

                    <div className="ats">
                        <div className="ats-head">
                            <strong>Instant ATS scan</strong>
                            <span className="badge">{resume.trim() ? `${score}%` : "—"}</span>
                        </div>
                        <ul className="ats-list">
                            {checks.map((c) => (
                                <li key={c.id} className={c.pass ? "ok" : "bad"}>
                                    <b>{c.pass ? "Pass" : "Fix"}</b> {c.label}
                                    <small>{c.detail}</small>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="primary" type="submit" disabled={busy}>
                        {busy ? "Working…" : "Run review"}
                    </button>
                    {note ? <p className="note">{note}</p> : null}
                </div>
            </form>

            {analysis ? (
                <div className="results">
                    <div className="score-row">
                        <div className="score-card">
                            <span>Overall</span>
                            <strong>{analysis.overallScore}</strong>
                        </div>
                        <div className="score-card">
                            <span>ATS</span>
                            <strong>{analysis.atsScore}</strong>
                        </div>
                        <p className="verdict">{analysis.verdict}</p>
                    </div>

                    <div className="keyword-row">
                        <div>
                            <h2>Matched</h2>
                            <p>{analysis.keywords?.matched?.join(", ") || "None"}</p>
                        </div>
                        <div>
                            <h2>Missing</h2>
                            <p>{analysis.keywords?.missing?.join(", ") || "None"}</p>
                        </div>
                    </div>

                    <h2>Rewrite this bullet</h2>
                    {(analysis.bullets || []).map((b) => (
                        <div key={b.original} className="bullet-card">
                            <p><b>Now:</b> {b.original}</p>
                            <p><b>Better:</b> {b.rewrite}</p>
                            <p className="note">{b.why}</p>
                        </div>
                    ))}

                    <h2>Cover letter</h2>
                    <pre className="letter">{analysis.coverLetter}</pre>

                    <h2>Interview</h2>
                    {(analysis.interview || []).map((item) => (
                        <div key={item.question} className="bullet-card">
                            <p><b>{item.question}</b></p>
                            <p>{item.starAnswer}</p>
                            <p className="note">{item.whyTheyAsk}</p>
                        </div>
                    ))}

                    <h2>7-day plan</h2>
                    <ol className="plan">
                        {(analysis.actionPlan || []).map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </div>
            ) : null}
        </section>
    );
}