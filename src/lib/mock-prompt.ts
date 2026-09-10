import type { PromptKit, Shot } from "./types-prompt";

const PLATFORM_NOTE: Record<string, string> = {
    facebook: "Reels up to 90s. First 3 seconds must show the mess or the hook. Caption can be longer.",
    instagram: "Reels 9:16. Keep on-screen text off the prompt. Hashtags in one cluster at the end.",
    youtube: "Shorts max 60s. Title carries search words. Description can hold chapters later.",
};

function shotsFor(duration: number, niche: string): Shot[] {
    if (niche === "renovation") {
        const all: Shot[] = [
            { second: "0-2", camera: "locked wide, chest height", action: "Overgrown facade, still air, rust on the gate", light: "soft overcast" },
            { second: "2-5", camera: "same lockoff", action: "Debris lifted, weeds pulled, water hits the wall", light: "harder midday" },
            { second: "5-8", camera: "same lockoff", action: "Fresh paint, cleared path, plants set in a line", light: "warm late day" },
            { second: "8-10", camera: "slow push 1 metre", action: "Porch chair, sea edge, evening calm", light: "golden hour" },
            { second: "10-15", camera: "hold", action: "Hold the finished porch. No extra motion", light: "last light" },
        ];
        return duration <= 6 ? all.slice(0, 3) : duration <= 10 ? all.slice(0, 4) : all;
    }

    if (niche === "fashion") {
        return [
            { second: "0-2", camera: "medium, eye level", action: "Model steps onto a concrete balcony", light: "cold daylight" },
            { second: "2-4", camera: "slow side slide", action: "Wind moves the fabric. City stays soft behind", light: "overcast" },
            { second: "4-6", camera: "hold", action: "Look off-camera. End still", light: "even grey" },
        ].slice(0, duration <= 6 ? 3 : 4);
    }

    return [
        { second: "0-3", camera: "low among stems", action: "Wet roses, drop on a petal", light: "after rain" },
        { second: "3-8", camera: "slow push down the path", action: "Robin lands, leaves shake", light: "golden hour" },
        { second: "8-15", camera: "hold on one bloom", action: "Drop falls. Garden stays quiet", light: "warm rim" },
    ].slice(0, duration <= 6 ? 2 : duration <= 10 ? 3 : 3);
}

export function mockPromptKit(input: {
    platform: string;
    duration: number;
    niche: string;
    mood: string;
    brief: string;
    keep: string;
}): PromptKit {
    const shotList = shotsFor(input.duration, input.niche);
    const mood =
        input.mood === "golden-hour"
            ? "golden hour, warm rim light, wet highlights"
            : input.mood === "cold"
                ? "cool daylight, low saturation, quiet wind"
                : "cinematic natural light, grounded, no glow haze";

    const masterPrompt = [
        `Vertical 9:16 photoreal video, ${input.duration} seconds.`,
        input.brief.trim(),
        mood + ".",
        input.keep.trim(),
        "Real physics. No extra people unless asked. No on-screen titles. No brand logos.",
        "Camera moves only as the shot list says.",
    ]
        .filter(Boolean)
        .join(" ");

    return {
        title:
            input.niche === "renovation"
                ? "From ruin to porch light"
                : input.niche === "fashion"
                    ? "Quiet balcony look"
                    : "Garden after rain",
        hookOnScreen:
            input.niche === "renovation" ? "This house was left behind." : "Wait for the last second.",
        shotList,
        masterPrompt,
        negativePrompt:
            "text overlay, watermark, extra people, extra limbs, warped architecture, cartoon, plastic skin, logo, shaky handheld, 16:9",
        captionDraft:
            input.niche === "renovation"
                ? "Same camera. Same house. Ten seconds from neglected to livable."
                : input.brief.slice(0, 120),
        hashtags: [
            "#reels",
            input.niche === "renovation" ? "#hometransformation" : input.niche === "fashion" ? "#lookbook" : "#gardentok",
            "#9x16",
            "#cinematic",
        ],
        platformNotes: PLATFORM_NOTE[input.platform] || PLATFORM_NOTE.instagram,
    };
}