'use client';

import { useSearchParams } from 'next/navigation';
import Video from '@/src/components/videopage/video';
import Captions from '@/src/components/videopage/captions';

export default function VideoPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const videoId = url ? extractVideoId(url) : null;

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      <Video url={url} />
      {videoId && <Captions videoId={videoId} />}
    </div>
  );
}

function extractVideoId(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  return match ? match[1] : null;
}
