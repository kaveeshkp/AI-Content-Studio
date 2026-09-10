export type CampaignSample = {
    id: string;
    label: string;
    topic: string;
    audience: string;
    language: "en" | "mix";
    platforms: Array<"facebook" | "instagram" | "youtube">;
};

export const CAMPAIGN_SAMPLES: CampaignSample[] = [
    {
        id: "villa",
        label: "Coastal villa Reel",
        topic: "10-second timelapse: neglected coastal house cleaned into a small villa.",
        audience: "Home-renovation and calm-living viewers on Reels",
        language: "en",
        platforms: ["facebook", "instagram", "youtube"],
    },
    {
        id: "mix",
        label: "Sinhala + English garden",
        topic: "Rose garden after rain at golden hour. Mind-relaxing clip.",
        audience: "Sri Lankan viewers who watch calm nature Reels",
        language: "mix",
        platforms: ["facebook", "instagram"],
    },
];