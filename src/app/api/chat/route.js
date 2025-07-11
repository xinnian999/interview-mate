const BASE_URL = 'https://api.deepseek.com';
const PATH = '/chat/completions';
const MODEL = 'deepseek-chat';
const API_KEY = `Bearer sk-e5d58b69a0fa43d089a6f0152c06b326`; // 环境变量中取出

export async function POST(req) {
    const body = await req.json();

    const upstreamRes = await fetch(BASE_URL + PATH, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: API_KEY,
        },
        body: JSON.stringify({
            model: MODEL,
            stream: true,
            ...body, // 接收 messages 或其他参数
        }),
    });

    return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
