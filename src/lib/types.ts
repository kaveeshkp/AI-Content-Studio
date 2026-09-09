export type ReviewBullet = {
    original: string;
    issue: string;
    rewrite: string;
    why: string;
};

export type InterviewItem = {
    question: string;
    starAnswer: string;
    whyTheyAsk: string;
};

export type Analysis = {
    overallScore: number;
    atsScore: number;
    verdict: string;
    keywords: { matched: string[]; missing: string[] };
    bullets: ReviewBullet[];
    coverLetter: string;
    interview: InterviewItem[];
    actionPlan: string[];
};

export type SavedReview = {
    id: string;
    createdAt: string;
    resume: string;
    job: string;
    analysis: Analysis;
};