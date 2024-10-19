'use client';

import { useState, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import { Button } from "@/src/components/ui/button"
import { MicrophoneButton } from '@/src/components/MicrophoneButton';
import { useAgent } from '@/src/hooks/use-agent';
import { RoomComponent } from '@/src/components/room-component';

interface VideoProps {
  url: string | null;
}

export default function Video({ url }: VideoProps) {
  const [videoId, setVideoId] = useState('');
  // const { connect } = useConnection();

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

  // const handleTalkToPodcast = useCallback(async () => {
  //   if (!state.isConnected) {
  //     await connect(videoId);
  //   }
  //   dispatch({ type: 'SET_CHAT_OPEN', payload: true });
  // }, [videoId, state.isConnected, connect, dispatch]);

  return (
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mb-8">
        {videoId && (
        <div className="w-full">
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '390',
            }}
            className="rounded-xl overflow-hidden"
          />
          {/* <RoomComponent /> */}
          {/* <Button
            onClick={handleTalkToPodcast}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            disabled={state.isConnecting}
          >
            {state.isConnecting ? 'Connecting...' : 'Talk to Podcast'}
          </Button>
          {state.isChatOpen && (
            <div className="mt-4">
              <MicrophoneButton />
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
