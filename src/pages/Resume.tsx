import { useMemo, useState } from "react";
import { RESUME_SAMPLES } from "../data/samples";
import { atsScore, inspectResume } from "../lib/ats";

export default function Resume() {
    const [resume, setResume] = useState("");
    const [job, setJob] = useState("");
    const [note, setNote] = useState("");

    const checks = useMemo(() => inspectResume(resume), [resume]);
    const score = atsScore(checks);

    function loadSample(id: string) {
        const pack = RESUME_SAMPLES.find((s) => s.id === id);
        if (!pack) return;
        setResume(pack.resume);
        setJob(pack.job);
        setNote("Sample loaded. ATS scan is instant. AI review is next session.");
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!resume.trim() || !job.trim()) {
            setNote("Paste both a resume and a job description first.");
            return;
        }
        window.localStorage.setItem(
            "caliber.draft",
            JSON.stringify({ resume, job, savedAt: new Date().toISOString() }),
        );
        setNote("Draft saved on this computer. AI review is the next step — not today.");
    }

    return (
        <section>
            <p className="kicker">Module 01 · no AI yet</p>
            <h1>Resume Reviewer</h1>
            <p className="lead">
                Load a sample or paste your own text. The ATS panel updates as you type.
                Do not add an API key in this step.
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
                        placeholder="Paste plain text. PDF upload comes later."
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

                    <button className="primary" type="submit">
                        Save draft
                    </button>
                    {note ? <p className="note">{note}</p> : null}
                </div>
            </form>
        </section>
    );
}