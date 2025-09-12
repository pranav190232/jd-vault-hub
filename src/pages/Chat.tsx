import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Message {
  id: number;
  from: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const chats: Chat[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://picsum.photos/seed/user1/100",
    lastMessage: "Hey! How are you doing?",
    time: "2m ago",
    unread: 2
  },
  {
    id: 2,
    name: "Emma Davis",
    avatar: "https://picsum.photos/seed/user2/100",
    lastMessage: "That sounds great!",
    time: "1h ago",
    unread: 0
  },
  {
    id: 3,
    name: "Ryan Wilson",
    avatar: "https://picsum.photos/seed/user3/100",
    lastMessage: "See you tomorrow",
    time: "3h ago",
    unread: 1
  },
  {
    id: 4,
    name: "Lisa Chen",
    avatar: "https://picsum.photos/seed/user4/100",
    lastMessage: "Thanks for the help!",
    time: "1d ago",
    unread: 0
  }
];

const initialMessages: Message[] = [
  {
    id: 1,
    from: "Alex Johnson",
    text: "Hey! How are you doing?",
    time: "10:30 AM",
    isMe: false
  },
  {
    id: 2,
    from: "Me",
    text: "I'm doing great! How about you?",
    time: "10:32 AM",
    isMe: true
  },
  {
    id: 3,
    from: "Alex Johnson",
    text: "Pretty good! Working on some exciting projects",
    time: "10:35 AM",
    isMe: false
  },
  {
    id: 4,
    from: "Me",
    text: "That's awesome! Would love to hear about them",
    time: "10:36 AM",
    isMe: true
  }
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      from: "Me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedChat.id === chat.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold truncate">{chat.name}</p>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedChat.name}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => alert("Video Call Started – Demo Only")}
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;