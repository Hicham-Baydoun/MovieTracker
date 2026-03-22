import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export default function MovieAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'assistant', text: 'Under production' },
  ]);

  const sendMessage = () => {
    const message = input.trim();
    if (!message) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: message,
    };

    const assistantReply: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      text: 'Under production',
    };

    setMessages((prev) => [...prev, userMessage, assistantReply]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-[320px] shadow-xl mb-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Movie Assistant</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
                aria-label="Close movie assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This assistant will help users find and manage movies in future updates.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-44 overflow-y-auto space-y-2 rounded-md border bg-muted/20 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`text-sm rounded-md px-3 py-2 max-w-[85%] ${
                    message.role === 'assistant'
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-secondary text-secondary-foreground ml-auto'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
              />
              <Button size="icon" onClick={sendMessage} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open movie assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
