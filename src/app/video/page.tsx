'use client';

import { useSearchParams } from 'next/navigation';
import Video from '@/src/components/videopage/video';
import { RoomComponent } from '@/src/components/videopage/room-component';

export default function VideoPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const videoId = url ? extractVideoId(url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br max-h-screen from-orange-50 via-red-50 to-orange-100">
      <div className="max-w-full mx-auto flex">
        <div className="w-1/2 max-h-screen p-2">
          <Video url={url} />
        </div>
        <div className='w-1/2 max-h-screen p-2'>
          <RoomComponent />
        </div>
      </div>
    </div>
  );
}

function extractVideoId(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  return match ? match[1] : null;
}
