'use client';

import { useSearchParams } from 'next/navigation';
import Video from '@/src/components/videopage/video';
import Captions from '@/src/components/videopage/captions';

export default function VideoPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const videoId = url ? extractVideoId(url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <Video url={url} />
        </div>
        <div className="lg:col-span-1">
          {videoId && <Captions videoId={videoId} />}
        </div>
      </div>
    </div>
  );
}

function extractVideoId(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  return match ? match[1] : null;
}
