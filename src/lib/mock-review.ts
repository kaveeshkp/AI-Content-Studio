import { inspectResume, atsScore } from "./ats";
import type { Analysis } from "./types";

const STOP = new Set([
    "the", "and", "for", "with", "that", "this", "from", "your", "you", "are",
    "will", "have", "has", "was", "were", "our", "must", "need", "junior",
    "senior", "intern", "role", "team", "work", "working",
]);

function tokens(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w));
}

function unique(list: string[]): string[] {
    return [...new Set(list)];
}

export function mockReview(resume: string, job: string): Analysis {
    const checks = inspectResume(resume);
    const ats = atsScore(checks);
    const jobWords = unique(tokens(job)).slice(0, 40);
    const resumeWords = new Set(tokens(resume));
    const matched = jobWords.filter((w) => resumeWords.has(w)).slice(0, 10);
    const missing = jobWords.filter((w) => !resumeWords.has(w)).slice(0, 8);

    const keywordScore = jobWords.length
        ? Math.round((matched.length / Math.min(jobWords.length, 12)) * 100)
        : 50;
    const overall = Math.max(28, Math.min(92, Math.round(ats * 0.55 + keywordScore * 0.45)));

    const lines = resume.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 24);
    const weak = lines.find((l) => /responsible for|i was|i built|i wrote/i.test(l));

    const bullets = weak
        ? [{
            original: weak,
            issue: "Weak or first-person phrasing.",
            rewrite: weak
                .replace(/^i was /i, "")
                .replace(/^i /i, "")
                .replace(/responsible for/i, "Owned")
                .replace(/\.$/, "") + " and recorded the result.",
            why: "Recruiters scan for verbs and outcomes, not duties.",
        }]
        : [{
            original: lines[0] || "Project line missing",
            issue: "No clear result on the opening line.",
            rewrite: "Shipped a web project used by a real user group and documented setup in Git.",
            why: "Lead with a shipped thing, then the stack.",
        }];

    const verdict =
        overall >= 75
            ? "Ready to send with small edits."
            : overall >= 55
                ? "Usable, but keywords and bullets need work."
                : "Too thin for this job. Add proof before you apply.";

    return {
        overallScore: overall,
        atsScore: ats,
        verdict,
        keywords: { matched, missing },
        bullets,
        coverLetter: `Dear Hiring Team,\n\nI am applying for this role because my recent coursework and project work map to the skills in the posting. I can contribute on small UI tasks, basic data work, and test notes from week one.\n\nI do not invent tools I have not used. I am ready to show a short demo of one project.\n\nThank you for your time.`,
        interview: [
            {
                question: "Walk me through one project on this resume.",
                starAnswer: "Situation: academic / client web project. Task: make a working flow. Action: designed pages, stored data in SQL, tested the path. Result: a demoable app I can run live.",
                whyTheyAsk: "They want proof you shipped something, not a tool list.",
            },
            {
                question: "What do you do when a page breaks?",
                starAnswer: "Reproduce it, check the console, isolate the last change, write the failing step down, then fix and retest.",
                whyTheyAsk: "Juniors are hired for debugging habits.",
            },
        ],
        actionPlan: [
            "Move contact details to line 1.",
            "Replace 'responsible for' with a verb + object.",
            `Add these job words only if they are true: ${missing.slice(0, 4).join(", ") || "none missing"}.`,
            "Put one number on a project line.",
            "Keep the resume at one page.",
            "Send the cover letter with the same project as the resume.",
            "Prepare a 60-second demo of one repo.",
        ],
    };
}