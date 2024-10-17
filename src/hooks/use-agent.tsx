import { useCallback } from 'react';
import { usePlaygroundState } from './use-playground-state';
import { Room } from 'livekit-client';

export function useAgent() {
  const { state, dispatch } = usePlaygroundState();

  const connect = useCallback(async (videoId: string) => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    try {
      const response = await fetch(`/api/livekit?room=${videoId}&username=user_${Math.random().toString(36).substr(2, 9)}`);
      const { token } = await response.json();
      
      const room = new Room();
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
      
      dispatch({ type: 'SET_CONNECTED', payload: true });
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    // Implement disconnect logic
  }, []);

  const sendMessage = useCallback((message: string) => {
    // Implement send message logic
    dispatch({ type: 'ADD_MESSAGE', payload: `You: ${message}` });
  }, [dispatch]);

  return { connect, disconnect, sendMessage };
}
