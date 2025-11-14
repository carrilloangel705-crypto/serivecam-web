import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { user_input } = await request.json();

  const n8nWebhookUrl = 'https://carrisho300.app.n8n.cloud/webhook/8d1daab2-ef15-4d98-ab06-87adb2076633/chat';

  const n8nResponse = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatInput: user_input }),
  });

  const n8nChatbotResponse = await n8nResponse.json();

  return NextResponse.json(n8nChatbotResponse, { status: n8nResponse.status });
}
