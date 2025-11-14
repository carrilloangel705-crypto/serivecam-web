import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user_input } = await request.json();

    if (!user_input) {
      return NextResponse.json({ error: 'Bad Request: user_input is missing.' }, { status: 400 });
    }

    const n8nWebhookUrl = 'https://carrisho300.app.n8n.cloud/webhook/8d1daab2-ef15-4d98-ab06-87adb2076633/chat';

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatInput: user_input }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`n8n webhook returned an error: ${n8nResponse.status}`, errorText);
      return NextResponse.json(
        { 
          error: 'The chatbot service returned an error.', 
          details: errorText.substring(0, 100) 
        },
        { status: 500 }
      );
    }

    const n8nChatbotResponse = await n8nResponse.json();
    return NextResponse.json(n8nChatbotResponse, { status: 200 });

  } catch (error) {
    console.error('A fatal error occurred in the chatbot API proxy:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}