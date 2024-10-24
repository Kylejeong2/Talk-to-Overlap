'use client';

import React, { useState, useEffect } from 'react';
import Video from '@/components/videopage/video';
import { RoomComponent } from '@/components/videopage/room-component';
import { VideoProvider } from '@/hooks/VideoContext';

type Props = {
  videoId: string;
}
const VideoPage = ({ videoId  }: Props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Start processing video link
        processVideoLink(videoId).then(() => {
            setLoading(false); // Set loading to false when embeddings are ready
        });
    }, [videoId]);

    return (
        <VideoProvider>
            <div className="min-h-screen bg-gradient-to-br max-h-screen from-orange-50 via-red-50 to-orange-100">
                {loading ? (
                    <div className="spinner">Loading...</div>
                ) : (
                    <div className="max-w-full mx-auto flex">
                        <div className="w-1/2 max-h-screen p-2">
                            <Video url={videoId} />
                        </div>
                        <div className='w-1/2 max-h-screen p-2'>
                            <RoomComponent />
                        </div>
                    </div>
                )}
            </div>
        </VideoProvider>
    );
};

export default VideoPage;

async function processVideoLink(videoId: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/process_video`, {
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
    } catch (error) {
        console.error('Error processing video link:', error);
    }
}
