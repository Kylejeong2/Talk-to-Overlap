import { useState } from 'react';
import { Button } from "@/src/components/ui/button"

export function MicrophoneButton() {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording logic here
  };

  return (
    <Button
      onClick={handleToggleRecording}
      className={`rounded-full p-4 ${
        isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
      }`}
    >
      {isRecording ? '🎙️' : '🎤'}
    </Button>
  );
}
