import type { CampaignKit, PlatformPack } from "./types-campaign";

function pack(
    platform: PlatformPack["platform"],
    topic: string,
    language: string,
): PlatformPack {
    const mix = language === "mix";

    if (platform === "youtube") {
        return {
            platform,
            title: mix ? "After the rain | Rose garden Shorts" : "Abandoned house to villa | 10s Short",
            hook: "Watch the last second.",
            caption: mix
                ? topic + " Calm clip. Subscribe if you want more quiet nature Shorts."
                : topic + " Full clean-up in one locked shot. Subscribe for more rebuilds.",
            hashtags: ["#shorts", "#timelapse", mix ? "#srilanka" : "#renovation"],
            extra: "YouTube: put search words in the title. Description can stay short for Shorts.",
        };
    }

    if (platform === "facebook") {
        return {
            platform,
            title: mix ? "Rain wela garden eka" : "Same house. Ten seconds.",
            hook: mix ? "Me last second eka balanna." : "Do not scroll before 0:08.",
            caption: mix
                ? "Rain wela garden eka. Golden hour. Quiet video — share if you need a break."
                : "Locked camera. Weeds, wash, paint, porch light. Share with someone fixing a house.",
            hashtags: ["#reels", "#facebookreels", mix ? "#peacfull" : "#home"],
            extra: "Facebook: longer caption is fine. Ask one question at the end.",
        };
    }

    return {
        platform,
        title: mix ? "Garden after rain" : "Ruin to porch light",
        hook: mix ? "Wait for the robin." : "This house was left behind.",
        caption: mix
            ? "After rain. Golden hour. No talking. Save this for later."
            : "Same frame the whole time. Save this if you like clean transformations.",
        hashtags: ["#reels", "#instagramreels", mix ? "#mindrelaxing" : "#beforeandafter"],
        extra: "Instagram: keep the caption short. Hashtags in one block at the end.",
    };
}

export function mockCampaign(input: {
    topic: string;
    audience: string;
    language: "en" | "mix";
    platforms: Array<"facebook" | "instagram" | "youtube">;
}): CampaignKit {
    const platforms = input.platforms.length
        ? input.platforms
        : (["instagram"] as const);

    return {
        recommendedLengthSeconds: 10,
        thumbnailPrompt: `9:16 still from the video. ${input.topic} No text on the thumbnail.`,
        postingWindows: [
            { label: "Thu–Sun 7.30–9.30 pm", reason: "Local evening scroll after work." },
            { label: "Sat 10–11 am", reason: "Weekend leisure watch." },
            { label: "Sun 8–9 pm", reason: "Highest catch-up window." },
        ],
        checklist: [
            "Export 9:16, 1080x1920.",
            "No watermark from another app.",
            "First frame must read without sound.",
            "Caption matches the platform pack below.",
            "Cover / thumbnail is a real frame, not a random crop.",
            "Do not post the same caption on all three apps.",
        ],
        packs: platforms.map((p) => pack(p, input.topic, input.language)),
    };
}