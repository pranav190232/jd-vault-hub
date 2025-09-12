import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Story {
  id: number;
  user: string;
  avatar: string;
  image: string;
}

const stories: Story[] = [
  {
    id: 1,
    user: "Your Story",
    avatar: "https://picsum.photos/seed/currentuser/100",
    image: "https://picsum.photos/seed/story1/400/600"
  },
  {
    id: 2,
    user: "Alex",
    avatar: "https://picsum.photos/seed/user1/100",
    image: "https://picsum.photos/seed/story2/400/600"
  },
  {
    id: 3,
    user: "Emma",
    avatar: "https://picsum.photos/seed/user2/100",
    image: "https://picsum.photos/seed/story3/400/600"
  },
  {
    id: 4,
    user: "Ryan",
    avatar: "https://picsum.photos/seed/user3/100",
    image: "https://picsum.photos/seed/story4/400/600"
  },
  {
    id: 5,
    user: "Lisa",
    avatar: "https://picsum.photos/seed/user4/100",
    image: "https://picsum.photos/seed/story5/400/600"
  },
  {
    id: 6,
    user: "David",
    avatar: "https://picsum.photos/seed/user5/100",
    image: "https://picsum.photos/seed/story6/400/600"
  }
];

const StoryRing = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className="mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <Dialog key={story.id}>
            <DialogTrigger asChild>
              <div 
                className="flex-shrink-0 cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <div className={`relative ${story.id === 1 ? '' : 'p-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full'}`}>
                  <Avatar className="w-16 h-16 border-2 border-background">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.user[0]}</AvatarFallback>
                  </Avatar>
                  {story.id === 1 && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      +
                    </div>
                  )}
                </div>
                <p className="text-xs text-center mt-1 max-w-[64px] truncate">
                  {story.user}
                </p>
              </div>
            </DialogTrigger>
            
            <DialogContent className="p-0 max-w-sm mx-auto bg-black border-0">
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={`${story.user}'s story`}
                  className="w-full h-[600px] object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.user[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-semibold text-sm">{story.user}</span>
                  <span className="text-white/70 text-xs">2h</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default StoryRing;