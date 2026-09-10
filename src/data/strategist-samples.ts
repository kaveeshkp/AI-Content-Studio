export type StrategistSample = {
    id: string;
    label: string;
    platform: "facebook" | "instagram" | "youtube";
    duration: 6 | 10 | 15;
    niche: string;
    mood: string;
    brief: string;
    keep: string;
};

export const STRATEGIST_SAMPLES: StrategistSample[] = [
    {
        id: "villa",
        label: "Coastal house timelapse",
        platform: "instagram",
        duration: 10,
        niche: "renovation",
        mood: "cinematic",
        brief:
            "Neglected coastal house. Overgrown yard, stained walls, rusty gate. Clean and paint it into a small villa. End on a calm evening porch.",
        keep: "Fixed camera height at chest level. No extra people. No text on screen. 9:16 only.",
    },
    {
        id: "garden",
        label: "Rose garden after rain",
        platform: "facebook",
        duration: 15,
        niche: "nature",
        mood: "golden-hour",
        brief:
            "English-style rose garden after light rain. Wet petals, robin, slow push through the path at golden hour.",
        keep: "No people. No logos. Keep raindrops on petals.",
    },
    {
        id: "lookbook",
        label: "Fashion lookbook",
        platform: "youtube",
        duration: 6,
        niche: "fashion",
        mood: "cold",
        brief:
            "One model, one outfit change implied by cut. Concrete balcony, wind, city behind. Quiet luxury, not runway chaos.",
        keep: "One person only. No brand names. Face can show. 9:16.",
    },
];