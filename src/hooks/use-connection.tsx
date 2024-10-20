"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
} from "react";
import { VoiceId } from "@/src/data/voices";

import { TurnDetectionTypeId } from "@/src/data/turn-end-types";
import { ModalitiesId } from "@/src/data/modalities";
import { ModelId } from "@/src/data/models";
import { TranscriptionModelId } from "@/src/data/transcription-models";
import { ChatbotData } from  "@/src/data/chatbot-data"
import { useTranscript } from '@/src/hooks/TranscriptContext';

export type ConnectFn = () => Promise<void>;

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  data: ChatbotData;
  voice: VoiceId;
  disconnect: () => Promise<void>;
  connect: ConnectFn;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined,
);

export const ConnectionProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const { summary } = useTranscript();
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    shouldConnect: boolean;
    voice: VoiceId;
  }>({ wsUrl: "", token: "", shouldConnect: false, voice: VoiceId.alloy });

  // const getTranscription = async () => {
  //   try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transcript`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ videoId: videoId })
  //       });
        
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch captions');
  //       }
  //     }catch(e) {
  //       console.error("Error Getting Transcription")
  //     }
  // }

  const data = {
    instructions: `You are a podcaster who is an expert on whatever you're talking about. Here's a summary of the podcast transcript: ${summary}`,
    openaiAPIKey: process.env.OPENAI_API_KEY,
    sessionConfig: {
      model: ModelId.gpt_4o_realtime,
      transcriptionModel: TranscriptionModelId.whisper1,
      turnDetection: TurnDetectionTypeId.server_vad,
      modalities: ModalitiesId.text_and_audio,
      voice: VoiceId.alloy,
      temperature: 0.8,
      maxOutputTokens: 1000,
      vadThreshold: 0.5,
      vadSilenceDurationMs: 200,
      vadPrefixPaddingMs: 300,
    },
  } as ChatbotData;

  const connect = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/livekit`, { // getting room name etc
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const { accessToken, url } = await response.json();

    setConnectionDetails({
      wsUrl: url,
      token: accessToken,
      shouldConnect: true,
      voice: data.sessionConfig.voice,
    });
  };

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        voice: connectionDetails.voice,
        data,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
};
