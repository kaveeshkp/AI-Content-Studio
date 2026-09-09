import type { SavedReview } from "./types";

const KEY = "studio.reviews";

export function loadReviews(): SavedReview[] {
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as SavedReview[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveReview(item: SavedReview): void {
    const next = [item, ...loadReviews()].slice(0, 20);
    window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearReviews(): void {
    window.localStorage.removeItem(KEY);
}