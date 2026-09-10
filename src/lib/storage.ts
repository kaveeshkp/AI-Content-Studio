import type { SavedPrompt } from "./types-prompt";
import type { SavedReview } from "./types";

const REVIEW_KEY = "studio.reviews";
const PROMPT_KEY = "studio.prompts";

export function loadReviews(): SavedReview[] {
    try {
        if (typeof window === "undefined") return [];
        const raw = window.localStorage.getItem(REVIEW_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as SavedReview[]) : [];
    } catch {
        return [];
    }
}

export function saveReview(item: SavedReview): void {
    const next = [item, ...loadReviews()].slice(0, 20);
    window.localStorage.setItem(REVIEW_KEY, JSON.stringify(next));
}

export function clearReviews(): void {
    window.localStorage.removeItem(REVIEW_KEY);
}

export function loadPrompts(): SavedPrompt[] {
    try {
        if (typeof window === "undefined") return [];
        const raw = window.localStorage.getItem(PROMPT_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as SavedPrompt[]) : [];
    } catch {
        return [];
    }
}

export function savePrompt(item: SavedPrompt): void {
    const next = [item, ...loadPrompts()].slice(0, 20);
    window.localStorage.setItem(PROMPT_KEY, JSON.stringify(next));
}

export function clearPrompts(): void {
    window.localStorage.removeItem(PROMPT_KEY);
}