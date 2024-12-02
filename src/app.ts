import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.192.0/http/file_server.ts";

const settings = (await import("./settings.json", { with: { type: "json" } })).default;

const PORT = 80;
const ALLOWED_FILES = ["main.ts", "input.txt"];

function toDay(path: string): number | null {
    const match = path.match(/^\/solutions\/(\d+)\/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)$/);
    return match ? parseInt(match[1], 10) : null;
}

function toFileType(path: string): string | null {
    const match = path.match(/^\/solutions\/(\d+)\/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)$/);
    return match ? (ALLOWED_FILES.includes(match[2]) ? match[2] : null) : null;
}

async function serveHTMlFile(path: string) {
    const file = await Deno.readTextFile(path);

    const content = file ? Object.entries(settings).reduce((acc, [key, value]) => (
        acc.replaceAll(`{{${key}}}`, value)
    ), file) : null;

    return new Response(content, {
        status: 200,
        headers: {
            "content-type": "text/html",
        }
    })
}

const handler = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === "/") {
        return await serveHTMlFile("src/routes/index.html");
    }

    if (url.pathname === "/app.css") {
        return await serveFile(request, "src/app.css");
    }

    if (url.pathname.startsWith(`/assets`)) {
        return await serveFile(request, url.pathname.substring(1));
    }

    if (url.pathname.match(/^\/day\/\d{1,2}$/)) {
        return await serveHTMlFile("src/routes/day/index.html");
    }

    if (url.pathname.match(/^\/solutions\/\d{1,2}\/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)$/)) {
        const day = toDay(url.pathname);
        const fileType = toFileType(url.pathname);

        return await serveFile(request, `solutions/day${day}/${fileType}`);
    }

    return new Response(null, {
        status: 302,
        headers: { "location": `/` },
    });
};

await serve(handler, { port: PORT });