import { useState } from 'react';
import { Button } from "@/src/components/ui/button"

interface ChatInterfaceProps {
  messages: string[];
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="mt-4">
      <div className="h-64 overflow-y-auto border rounded p-2">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage} className="rounded-r">Send</Button>
      </div>
    </div>
  );
}
