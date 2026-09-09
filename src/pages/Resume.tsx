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
    const [analysis, setAnalysis] = useState<Analysis | null>(null);

    const checks = useMemo(() => inspectResume(resume), [resume]);
    const score = atsScore(checks);

    function loadSample(id: string) {
        const pack = RESUME_SAMPLES.find((s) => s.id === id);
        if (!pack) return;
        setResume(pack.resume);
        setJob(pack.job);
        setAnalysis(null);
        setNote("Sample loaded. Run review when ready.");
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!resume.trim() || !job.trim()) {
            setNote("Paste both a resume and a job description first.");
            return;
        }

        const result = mockReview(resume, job);
        setAnalysis(result);
        saveReview({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            resume,
            job,
            analysis: result,
        });
        setNote("Local review saved. Open History to see the list.");
    }

    return (
        <section>
            <p className="kicker">Module 01 · local review</p>
            <h1>Resume Reviewer</h1>
            <p className="lead">
                Load a sample, check the ATS panel, then run a local review. This is not
                an AI model yet. It uses the same JSON shape the API will use later.
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
                        placeholder="Paste plain text."
                        rows={18}
                    />
                </label>

                <div className="stack">
                    <label className="field">
                        <span>Job description</span>
                        <textarea
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            placeholder="Paste the job you want."
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

                    <button className="primary" type="submit">Run local review</button>
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
                            <p>{analysis.keywords.matched.join(", ") || "None"}</p>
                        </div>
                        <div>
                            <h2>Missing</h2>
                            <p>{analysis.keywords.missing.join(", ") || "None"}</p>
                        </div>
                    </div>

                    <h2>Rewrite this bullet</h2>
                    {analysis.bullets.map((b) => (
                        <div key={b.original} className="bullet-card">
                            <p><b>Now:</b> {b.original}</p>
                            <p><b>Better:</b> {b.rewrite}</p>
                            <p className="note">{b.why}</p>
                        </div>
                    ))}

                    <h2>Cover letter</h2>
                    <pre className="letter">{analysis.coverLetter}</pre>

                    <h2>Interview</h2>
                    {analysis.interview.map((item) => (
                        <div key={item.question} className="bullet-card">
                            <p><b>{item.question}</b></p>
                            <p>{item.starAnswer}</p>
                            <p className="note">{item.whyTheyAsk}</p>
                        </div>
                    ))}

                    <h2>7-day plan</h2>
                    <ol className="plan">
                        {analysis.actionPlan.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </div>
            ) : null}
        </section>
    );
}