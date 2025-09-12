import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onAddPost: (post: {
    user: string;
    avatar: string;
    caption: string;
    image: string;
  }) => void;
}

const CreatePost = ({ onAddPost }: CreatePostProps) => {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!caption.trim() && !selectedImage) {
      toast({
        title: "Error",
        description: "Please add a caption or image",
        variant: "destructive"
      });
      return;
    }

    onAddPost({
      user: "You",
      avatar: "https://picsum.photos/seed/currentuser/100",
      caption: caption.trim(),
      image: selectedImage || "https://picsum.photos/seed/default/600/400"
    });

    setCaption("");
    setSelectedImage(null);
    setIsExpanded(false);
    
    toast({
      title: "Post Created!",
      description: "Your post has been shared successfully"
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/currentuser/100" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="resize-none min-h-[60px]"
            />
            
            {selectedImage && (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {isExpanded && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="ghost" size="sm" asChild>
                      <span className="cursor-pointer">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Add Photo
                      </span>
                    </Button>
                  </label>
                </div>
                
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setCaption("");
                      setSelectedImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handlePost}>
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;