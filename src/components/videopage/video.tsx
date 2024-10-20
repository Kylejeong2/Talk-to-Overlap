'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import Captions from './captions';

interface VideoProps {
  url: string | null;
}

export default function Video({ url }: VideoProps) {
  const [videoId, setVideoId] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<YouTube>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const onStateChange = (event: { target: any; data: number }) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      updateCurrentTime();
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const updateCurrentTime = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player && typeof player.getCurrentTime === 'function') {
        setCurrentTime(player.getCurrentTime());
      }
    }
  };

  const onReady = (event: { target: any }) => {
    // Update current time when the video is ready
    updateCurrentTime();
  };

  const onSeek = (event: { target: any; data: number }) => {
    // Update current time when the user seeks
    updateCurrentTime();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4">
        {videoId && (
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onStateChange={onStateChange}
            onReady={onReady}
            onSeek={onSeek}
            ref={playerRef}
            className="rounded-xl overflow-hidden h-full"
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {videoId && <Captions videoId={videoId} currentTime={currentTime} />}
      </div>
    </div>
  );
}
