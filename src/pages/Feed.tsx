import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Send } from "lucide-react";
import Navigation from "@/components/Navigation";
import CreatePost from "@/components/CreatePost";
import StoryRing from "@/components/StoryRing";

interface Post {
  id: number;
  user: string;
  avatar: string;
  caption: string;
  image: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

interface Comment {
  id: number;
  user: string;
  text: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: "Alex Johnson",
    avatar: "https://picsum.photos/seed/user1/100",
    caption: "Beautiful sunset at the beach! 🌅",
    image: "https://picsum.photos/seed/post1/600/400",
    likes: 42,
    liked: false,
    comments: [
      { id: 1, user: "Sarah", text: "Amazing shot!" },
      { id: 2, user: "Mike", text: "Love the colors" }
    ]
  },
  {
    id: 2,
    user: "Emma Davis",
    avatar: "https://picsum.photos/seed/user2/100",
    caption: "Coffee and coding session ☕💻",
    image: "https://picsum.photos/seed/post2/600/400",
    likes: 28,
    liked: true,
    comments: [
      { id: 1, user: "Tom", text: "That's the way!" }
    ]
  },
  {
    id: 3,
    user: "Ryan Wilson",
    avatar: "https://picsum.photos/seed/user3/100",
    caption: "Mountain hiking adventure! 🏔️",
    image: "https://picsum.photos/seed/post3/600/400",
    likes: 67,
    liked: false,
    comments: []
  }
];

const additionalPosts: Post[] = [
  {
    id: 4,
    user: "Lisa Chen",
    avatar: "https://picsum.photos/seed/user4/100",
    caption: "Delicious homemade pasta 🍝",
    image: "https://picsum.photos/seed/post4/600/400",
    likes: 35,
    liked: false,
    comments: [
      { id: 1, user: "Anna", text: "Recipe please!" }
    ]
  },
  {
    id: 5,
    user: "David Brown",
    avatar: "https://picsum.photos/seed/user5/100",
    caption: "New artwork finished! 🎨",
    image: "https://picsum.photos/seed/post5/600/400",
    likes: 89,
    liked: false,
    comments: [
      { id: 1, user: "Grace", text: "Incredible!" },
      { id: 2, user: "Jack", text: "So talented" }
    ]
  }
];

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [showAdditional, setShowAdditional] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleComment = (postId: number) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), user: "You", text: commentText }
            ]
          }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleLoadMore = () => {
    if (!showAdditional) {
      setPosts(prev => [...prev, ...additionalPosts]);
      setShowAdditional(true);
    }
  };

  const addNewPost = (newPost: Omit<Post, 'id' | 'likes' | 'liked' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now(),
      likes: 0,
      liked: false,
      comments: []
    };
    setPosts(prev => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <StoryRing />
        
        <div className="mb-6">
          <CreatePost onAddPost={addNewPost} />
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.user}</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full h-96 object-cover"
                />
                
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="p-0 h-auto"
                    >
                      <Heart 
                        className={`w-6 h-6 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Share className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <p className="font-semibold mb-1">{post.likes} likes</p>
                  <p className="mb-3">
                    <span className="font-semibold">{post.user}</span> {post.caption}
                  </p>
                  
                  {post.comments.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {post.comments.map((comment) => (
                        <p key={comment.id} className="text-sm">
                          <span className="font-semibold">{comment.user}</span> {comment.text}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAdditional && (
          <div className="text-center mt-8">
            <Button onClick={handleLoadMore} variant="outline">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;