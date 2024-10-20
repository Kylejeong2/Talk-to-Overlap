import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    const { transcript } = await request.json();

    try {
        const systemPrompt = `
            You are an expert at summarizing and you write elaborate and info-packed summarizes with all the key insights and including all the important concepts from text.
            Write the summary in exactly 10 sentences.
        `;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `
                This is the content: 
                """
                ${transcript}
                """
                `},
            ],
          });
        const summary = completion.choices[0].message.content;
        return NextResponse.json({ summary }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching Summary:', error);
        return NextResponse.json({ error: 'Error fetching Summary' }, { status: 500 });
    }
}
