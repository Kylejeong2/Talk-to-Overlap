import { NextResponse } from 'next/server';

interface TranscriptSegment {
    text: string;
    start: number;
    duration: number;
};

export async function POST(request: Request) {
    const { videoId } = await request.json();

    if (!videoId) {
        return NextResponse.json({ error: 'Invalid videoId' }, { status: 400 });
    }

    try {
        const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:5000';

        const response = await fetch(`${serverBaseUrl}/transcript`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TranscriptSegment[] = await response.json();

        const fullTranscript = data.map(segment => segment.text).join(' ');

        return NextResponse.json({transcript: fullTranscript}, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return NextResponse.json({ error: 'Error fetching transcript' }, { status: 500 });
    }
}
