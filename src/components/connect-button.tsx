"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { useConnection } from "@/src/hooks/use-connection";
import { Loader2, Mic } from "lucide-react";

export function ConnectButton() {
  const { connect, disconnect, shouldConnect } = useConnection();
  const [connecting, setConnecting] = useState<boolean>(false);

  const handleConnectionToggle = async () => {
    if (shouldConnect) {
      console.log("should connect")
      await disconnect();
    } else {
      console.log("initiate")
      await initiateConnection();
    }
  };

  const initiateConnection = useCallback(async () => {
    setConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(false);
    }
  }, [connect]);

  useEffect(() => {
    if (process.env.OPENAI_API_KEY) {
      initiateConnection();
    }
  }, [initiateConnection, process.env.OPENAI_API_KEY]);

  return ( 
    <>
      <Button
        onClick={handleConnectionToggle}
        disabled={connecting || shouldConnect}
        className="text-sm font-semibold bg-oai-green"
      >
        {connecting || shouldConnect ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Connect
          </>
        )}
      </Button>
    </>
  );
}