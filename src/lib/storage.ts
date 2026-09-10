import type { SavedCampaign } from "./types-campaign";
import type { SavedPrompt } from "./types-prompt";
import type { SavedReview } from "./types";

const REVIEW_KEY = "studio.reviews";
const PROMPT_KEY = "studio.prompts";
const CAMP_KEY = "studio.campaigns";

function read<T>(key: string): T[] {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
        return [];
    }
}

function write<T>(key: string, items: T[]) {
    window.localStorage.setItem(key, JSON.stringify(items.slice(0, 20)));
}

export function loadReviews(): SavedReview[] {
    return read<SavedReview>(REVIEW_KEY);
}
export function saveReview(item: SavedReview): void {
    write(REVIEW_KEY, [item, ...loadReviews()]);
}
export function clearReviews(): void {
    window.localStorage.removeItem(REVIEW_KEY);
}

export function loadPrompts(): SavedPrompt[] {
    return read<SavedPrompt>(PROMPT_KEY);
}
export function savePrompt(item: SavedPrompt): void {
    write(PROMPT_KEY, [item, ...loadPrompts()]);
}
export function clearPrompts(): void {
    window.localStorage.removeItem(PROMPT_KEY);
}

export function loadCampaigns(): SavedCampaign[] {
    return read<SavedCampaign>(CAMP_KEY);
}
export function saveCampaign(item: SavedCampaign): void {
    write(CAMP_KEY, [item, ...loadCampaigns()]);
}
export function clearCampaigns(): void {
    window.localStorage.removeItem(CAMP_KEY);
}