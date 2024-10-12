'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import YouTube from 'react-youtube';

export default function Video() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [videoId, setVideoId] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (typeof url === 'string') {
      const id = extractVideoId(url);
      if (id) {
        setVideoId(id);
      } else {
        console.error('Invalid YouTube URL');
      }
    }
  }, [url]);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    return match ? match[1] : null;
  };

  const handleTalkToPodcast = () => {
    setIsChatOpen(true);
    // TODO: Implement chat functionality
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {videoId && (
        <div className="w-full max-w-3xl">
          <YouTube
            videoId={videoId}
            opts={{
              height: '390',
              width: '640',
              playerVars: {
                autoplay: 1,
              },
            }}
          />
          <button
            onClick={handleTalkToPodcast}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Talk to Podcast
          </button>
        </div>
      )}
      {isChatOpen && (
        <div className="mt-4 w-full max-w-3xl">
          {/* TODO: Implement chat interface */}
          <p>Chat interface will be implemented here</p>
        </div>
      )}
    </div>
  );
}
