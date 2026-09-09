import { Link } from "react-router-dom";

const rooms = [
    {
        to: "/resume",
        title: "Resume Reviewer",
        meta: "Week 2",
        body: "Paste a resume and a job. Get ATS flags, rewrites, a cover letter, and interview answers.",
    },
    {
        to: "/strategist",
        title: "Prompt Strategist",
        meta: "Week 3",
        body: "Turn a short brief into a 9:16 shot list and a master prompt for Reels and Shorts.",
    },
    {
        to: "/campaign",
        title: "Campaign Planner",
        meta: "Week 4",
        body: "Get platform-ready captions, hashtags, and posting windows. No auto-publish in MVP.",
    },
];

export default function Home() {
    return (
        <section>
            <p className="kicker">One login · three rooms</p>
            <h1>Write the job kit. Then write the Reel.</h1>
            <p className="lead">
                AI Content Studio keeps resume work and social-video prompts in the same
                place. Today you only build the rooms. The tools get wired next week.
            </p>
            <div className="grid">
                {rooms.map((room) => (
                    <Link key={room.to} className="card" to={room.to}>
                        <span className="meta">{room.meta}</span>
                        <h2>{room.title}</h2>
                        <p>{room.body}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}