import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(path.join(root, ".env"));

const PORT = Number(process.env.PORT || 8787);
const API_KEY = process.env.XAI_API_KEY || process.env.OPENAI_API_KEY || "";
const BASE_URL = process.env.LLM_BASE_URL || "https://api.x.ai/v1";
const MODEL = process.env.LLM_MODEL || "grok-3";

function loadEnv(file) {
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const i = trimmed.indexOf("=");
        if (i < 1) continue;
        const key = trimmed.slice(0, i).trim();
        const value = trimmed.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) process.env[key] = value;
    }
}

function send(res, status, body) {
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    });
    res.end(JSON.stringify(body));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}

function stripFence(text) {
    return String(text || "")
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
}

function buildPrompt(resume, job) {
    return `You review resumes for intern and junior roles.
Return ONE json object only. No markdown.

Rules:
- Never invent employers, dates, tools, metrics, or degrees.
- If a number is missing, write [metric] in the rewrite.
- Keep coverLetter under 140 words.
- interview must have exactly 2 items.
- actionPlan must have exactly 7 short steps.

Schema:
{
  "overallScore": 0-100,
  "atsScore": 0-100,
  "verdict": "one sentence",
  "keywords": { "matched": [], "missing": [] },
  "bullets": [{ "original": "", "issue": "", "rewrite": "", "why": "" }],
  "coverLetter": "",
  "interview": [{ "question": "", "starAnswer": "", "whyTheyAsk": "" }],
  "actionPlan": ["", "", "", "", "", "", ""]
}

RESUME:
${resume.slice(0, 12000)}

JOB:
${job.slice(0, 8000)}`;
}

const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        send(res, 204, {});
        return;
    }

    if (req.method === "GET" && req.url === "/api/health") {
        send(res, 200, { ok: true, hasKey: Boolean(API_KEY), model: MODEL });
        return;
    }

    if (req.method !== "POST" || req.url !== "/api/review") {
        send(res, 404, { error: "Not found" });
        return;
    }

    if (!API_KEY) {
        send(res, 501, { error: "NO_KEY", message: "Add XAI_API_KEY to .env" });
        return;
    }

    try {
        const body = await readBody(req);
        const resume = String(body.resume || "").trim();
        const job = String(body.job || "").trim();
        if (!resume || !job) {
            send(res, 400, { error: "Resume and job are required" });
            return;
        }

        const upstream = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                temperature: 0.2,
                max_tokens: 4000,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: "You return valid JSON only." },
                    { role: "user", content: buildPrompt(resume, job) },
                ],
            }),
        });

        const data = await upstream.json();
        if (!upstream.ok) {
            send(res, 502, {
                error: "UPSTREAM",
                message: data.error?.message || "Model call failed",
            });
            return;
        }

        const text = stripFence(data.choices?.[0]?.message?.content);
        const analysis = JSON.parse(text);
        send(res, 200, { analysis, source: "model" });
    } catch (err) {
        send(res, 500, {
            error: "SERVER",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

server.listen(PORT, () => {
    console.log(`Review API on http://localhost:${PORT}`);
    console.log(API_KEY ? `Using ${MODEL}` : "No API key — client will use mock");
});