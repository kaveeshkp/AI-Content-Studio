export type AtsCheck = {
    id: string;
    label: string;
    pass: boolean;
    detail: string;
};

export function inspectResume(text: string): AtsCheck[] {
    const raw = text.trim();
    const lower = raw.toLowerCase();
    const hasText = raw.length > 0;

    const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(raw);
    const heading = /(education|experience|projects|skills|summary|work history)/i.test(raw);
    const years = /\b(20\d{2}|19\d{2})\b/.test(raw);
    const numbers = /\d/.test(raw);
    const firstPerson = /\b(i |i'|i’m|im |my )\b/i.test(" " + lower + " ");
    const responsible = /responsible for/i.test(raw);
    const phone = /(\+?\d[\d\s-]{7,}\d)/.test(raw);
    const long = raw.length >= 400;

    return [
        { id: "email", label: "Email on the page", pass: hasText && email, detail: email ? "Contact line found." : "Add an email near the top." },
        { id: "phone", label: "Phone number", pass: hasText && phone, detail: phone ? "Phone looks present." : "Add a phone number." },
        { id: "headings", label: "Normal section headings", pass: hasText && heading, detail: heading ? "Found headings like Skills." : "Use Education, Experience, Projects, Skills." },
        { id: "years", label: "Years / dates", pass: hasText && years, detail: years ? "Dates are visible." : "Add years, e.g. 2024 – 2026." },
        { id: "numbers", label: "At least one number", pass: hasText && numbers, detail: numbers ? "Numbers scan well." : "Add a count or year. Do not invent one." },
        { id: "length", label: "Enough text to scan", pass: long, detail: long ? `${raw.length} characters.` : "Too short for a real parse." },
        { id: "first-person", label: "Avoid I / me / my", pass: hasText && !firstPerson, detail: firstPerson ? "Write 'Built X', not 'I built X'." : "No first person found." },
        { id: "responsible", label: "Avoid “responsible for”", pass: hasText && !responsible, detail: responsible ? "Use Built, Tested, Shipped." : "No weak phrasing found." },
    ];
}

export function atsScore(checks: AtsCheck[]): number {
    if (checks.length === 0) return 0;
    return Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
}