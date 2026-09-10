export type PlatformPack = {
    platform: "facebook" | "instagram" | "youtube";
    title: string;
    caption: string;
    hashtags: string[];
    hook: string;
    extra: string;
};

export type CampaignKit = {
    recommendedLengthSeconds: number;
    thumbnailPrompt: string;
    postingWindows: { label: string; reason: string }[];
    checklist: string[];
    packs: PlatformPack[];
};

export type SavedCampaign = {
    id: string;
    createdAt: string;
    topic: string;
    audience: string;
    language: string;
    kit: CampaignKit;
};