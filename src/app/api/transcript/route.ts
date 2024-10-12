import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  try {
    const response = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId,
    });

    if (response.data.items && response.data.items.length > 0) {
      const captionTrack = response.data.items[0];
      // TODO: Fetch and process the actual transcript
      return res.status(200).json({ transcript: 'Transcript placeholder' });
    } else {
      return res.status(404).json({ error: 'No captions found for this video' });
    }
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return res.status(500).json({ error: 'Error fetching transcript' });
  }
}
