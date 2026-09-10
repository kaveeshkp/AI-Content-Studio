export type Shot = {
    second: string;
    camera: string;
    action: string;
    light: string;
};

export type PromptKit = {
    title: string;
    hookOnScreen: string;
    shotList: Shot[];
    masterPrompt: string;
    negativePrompt: string;
    captionDraft: string;
    hashtags: string[];
    platformNotes: string;
};

export type SavedPrompt = {
    id: string;
    createdAt: string;
    platform: string;
    duration: number;
    niche: string;
    mood: string;
    brief: string;
    kit: PromptKit;
};