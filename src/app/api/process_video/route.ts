import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const { videoId } = await req.json();
    if (!videoId) {
        return NextResponse.json({ error: 'Missing videoId in request body' }, { status: 400 });
    }

    try {
        // Call the backend server to process the video
        const response = await fetch(`${process.env.SERVER_BASE_URL}/process_video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
            throw new Error('Failed to process video');
        }

        const data = await response.json();
        if (data.status !== 'success') {
            throw new Error('Processing failed');
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error) {
        console.error('Error processing video:', error);
        return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
    }
}
