import { useState, useEffect, useRef } from 'react';

interface CaptionItem {
  text: string;
  start: number;
  duration: number;
}

interface CaptionsProps {
  videoId: string;
  currentTime: number;
}

export default function Captions({ videoId, currentTime }: CaptionsProps) {
  const [captions, setCaptions] = useState<CaptionItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transcript`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId: videoId })
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch captions');
        }

        const data = await res.json();
        if (data && typeof data === 'object' && Array.isArray(data.transcript)) {
          setCaptions(data.transcript);
        } else if (Array.isArray(data)) {
          setCaptions(data);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        console.error('Error fetching captions:', error);
        setError('Failed to load captions');
      }
    };

    fetchCaptions();
  }, [videoId]);

  useEffect(() => {
    if (captions && captionsRef.current) {
      const currentCaption = captions.find(
        (caption) => currentTime >= caption.start && currentTime < caption.start + caption.duration
      );
      if (currentCaption) {
        const captionElement = captionsRef.current.querySelector(`[data-start="${currentCaption.start}"]`);
        if (captionElement) {
          captionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentTime, captions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white h-full flex flex-col border-l p-2">
      <h2 className="text-xl font-semibold p-2 bg-red-500 text-white rounded-t-xl">Video Captions</h2>
      <div className="flex-grow overflow-y-auto p-4" ref={captionsRef}>
        {error ? (
          <p className="text-red-600 italic">{error}</p>
        ) : captions ? (
          captions.map((caption, index) => (
            <div 
              key={index} 
              className={`mb-3 pb-2 border-b border-gray-200 last:border-b-0 ${
                currentTime >= caption.start && currentTime < caption.start + caption.duration
                  ? 'bg-yellow-100'
                  : ''
              }`}
              data-start={caption.start}
            >
              <span className="text-red-500 font-medium mr-2">{formatTime(caption.start)}:</span>
              <span className="text-gray-700">{caption.text}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">Loading captions...</p>
        )}
      </div>
    </div>
  );
}
